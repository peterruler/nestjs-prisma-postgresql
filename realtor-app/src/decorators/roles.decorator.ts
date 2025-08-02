import { UserType } from 'generated/prisma';
import { SetMetadata } from '@nestjs/common';
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles);
