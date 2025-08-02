import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaModule } from 'src/prisma/prisma.module'; // Ensure PrismaModule is imported
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [HomeController],
  providers: [
    HomeService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor, // Use existing PrismaService instance
    },
  ],
})
export class HomeModule {}
