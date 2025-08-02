import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto, SigninDto, GenerateProductKeyDto } from '../dtos/auth.dto';
import { AuthService } from './auth.service';
import { UserType } from 'generated/prisma';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../decorators/user.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup/:userType')
  async signup(
    @Body() body: SignupDto,
    @Param('userType', new ParseEnumPipe(UserType)) userType: UserType,
  ) {
    if (userType !== UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException('');
      }
      const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
      const isValidProductKey = body.productKey
        ? await bcrypt.compare(validProductKey, body.productKey)
        : false;

      if (!isValidProductKey) {
        throw new UnauthorizedException('');
      }
    }
    return this.authService.signup(body, userType);
  }
  @Post('/signin')
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }
  @Post('/key')
  generateProductKey(@Body() { userType, email }: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
  @Get('/me')
  me(@User() user: UserInfo) {
    return user;
  }
}
