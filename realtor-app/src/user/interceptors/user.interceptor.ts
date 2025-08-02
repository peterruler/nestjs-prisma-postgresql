import { ExecutionContext, NestInterceptor, CallHandler } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, handler: CallHandler) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const token = request?.headers?.authorization?.split('Bearer ')[1];
    const user = jwt.decode(token);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.user = user;
    return handler.handle();
  }
}
