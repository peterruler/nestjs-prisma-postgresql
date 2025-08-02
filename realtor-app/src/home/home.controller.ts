import {
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Param,
  Query,
  Body,
  ParseIntPipe,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto, CreateHomeDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType, UserType } from 'generated/prisma';
import { User, UserInfo } from '../user/decorators/user.decorators';
import { AuthGuard } from '../guards/auth.guards';
import { Roles } from 'src/decorators/roles.decorator';
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice && maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;
    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };
    return this.homeService.getHomes(filters);
  }
  @Get(':id')
  getHomeById(@Param('id') id: number) {
    return this.homeService.getHomeById(id);
  }
  @Roles(UserType.REALTOR, UserType.ADMIN)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    return this.homeService.createHome(body, user.id);
  }
  @Roles(UserType.REALTOR)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.updateHomeById(id, body);
  }
  @Roles(UserType.REALTOR)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);
    if (realtor.id !== user.id) {
      throw new UnauthorizedException();
    }
    return this.homeService.deleteHomeById(id);
  }
}
