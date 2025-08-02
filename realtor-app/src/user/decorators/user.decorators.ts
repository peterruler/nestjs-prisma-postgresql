import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  name: string;
  id: number;
  iat: number;
  exp: number;
}
export const User = createParamDecorator((data, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return request.user;
});
