import { Injectable, ConflictException, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { UserType } from '@prisma/client';
import * as jwt from 'jsonwebtoken';

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}
interface SigninParams {
  email: string;
  password: string;
}
@Injectable()
export class AuthService {
  // Removed unused prismaService property
  constructor(private prisma: PrismaService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async signup({ email, password }: SignupParams, userType: UserType) {
    // Example return, replace with actual signup logic

    const userExists = await this.prisma.user.findUnique({
      where: { email },
    });
    if (userExists) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: {
        email,
        name: 'Default Name',
        phone: '000-000-0000',
        password: hashedPassword,
        user_type: userType, // Replace 'USER' with the appropriate value for your app
      },
    });
    const jwtSecret = process.env.JSON_KEY;
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined in environment variables');
    }
    return this.generateJWT(user.name, user.id);
  }
  async signin({ email, password }: SigninParams) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      throw new HttpException('Invalid credentials', 400);
    }
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);
    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 400);
    }
    const jwtSecret = process.env.JSON_KEY;
    if (!jwtSecret) {
      throw new Error('JWT secret is not defined in environment variables');
    }
    return this.generateJWT(user.name, user.id);
  }
  private generateJWT(name: string, id: number) {
    const jwtTokenSecret = process.env.JSON_KEY;
    if (!jwtTokenSecret) {
      throw new Error('JWT secret is not defined in environment variables');
    }
    // Ensure secret type is string for jwt.sign
    const secret: string = jwtTokenSecret;
    return jwt.sign(
      {
        name,
        id,
      },
      secret,
      {
        expiresIn: 3600000,
      },
    );
  }
  generateProductKey(email: string, userType: UserType) {
    const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return bcrypt.hash(string, 10);
  }
}
