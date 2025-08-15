/* eslint-disable @typescript-eslint/no-unsafe-call */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

interface JWTPayload {
  name: string;
  id: number;
  iat: number;
  exp: number;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (roles?.length) {
      const request = context.switchToHttp().getRequest();
      // Verwende get() Methode für Header-Zugriff
      const authorizationHeader = request.headers?.get?.('authorization') || request.headers['authorization'];
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const token = authorizationHeader?.startsWith('Bearer ')
        ? // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          authorizationHeader.split('Bearer ')[1]
        : undefined;
      try {
        if (!token || typeof token !== 'string') {
          throw new Error('Invalid token');
        }

        const secretKey = process.env.JSON_TOKEN_KEY;
        if (!secretKey) {
          throw new Error('Missing JSON_TOKEN_KEY environment variable');
        }

        const payload = jwt.verify(token, secretKey) as unknown as JWTPayload;

        const user = await this.prismaService.user.findUnique({
          where: {
            id: payload.id,
          },
        });

        if (!user) return false;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (roles.includes(user.user_type)) return true;

        return false;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return false;
      }
    }

    return true;
  }
}
