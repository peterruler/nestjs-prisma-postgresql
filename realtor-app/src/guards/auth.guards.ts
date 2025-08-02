import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from 'src/prisma/prisma.service';

interface JwtPayload {
  id: number;
  name: string;
  iat: number;
  exp: number;
}
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1) Determine the UserType that can execute the called endpoint
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-assignment
    const roles = this.reflector.getAllAndOverride('roles', [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      context.getHandler(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      context.getClass(),
    ]);

    // 2) Grab the JWT from the request header and verify it
    if (roles?.length) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const request = context.switchToHttp().getRequest();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const token = request.headers?.authorization?.split('Bearer ')[1];
      try {
        if (!process.env.JSON_KEY) {
          throw new Error('JSON_KEY is not defined in environment variables');
        }
        const payload = jwt.verify(token, process.env.JSON_KEY) as JwtPayload;
        // 3) Database request to get user by id
        const user = await this.prismaService.user.findUnique({
          where: { id: payload.id },
        });
        if (!user) {
          return false;
        }
        // 3) Check if the user has the required role
        // 4) Determine if the user has permission
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        if (roles.includes(user.user_type)) {
          return true;
        }
        return false;
      } catch (e) {
        return false; // Error during verification
      }
    }
    return false;
  }
}
