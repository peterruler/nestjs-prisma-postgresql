import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from 'generated/prisma';

interface GetHomesParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}
interface CreateHomeParams {
  address: string;
  city: string;
  price: number;
  landSize: number;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  propertyType: PropertyType;
  images: { url: string }[];
  realtorId: number; // Assuming realtorId is part of the home creation
}
interface UpdateHomeParams {
  address?: string;
  city?: string;
  price?: number;
  landSize?: number;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  propertyType?: PropertyType;
  realtorId?: number; // Assuming realtorId is part of the home creation
}
@Injectable()
export class HomeService {
  async updateHomeById(id: number, data: UpdateHomeParams) {
    const home = await this.prisma.home.findUnique({
      where: {
        id,
      },
    });

    if (!home) {
      throw new NotFoundException();
    }

    const updatedHome = await this.prisma.home.update({
      where: {
        id,
      },
      data,
    });

    return new HomeResponseDto(updatedHome);
  }
  getHomeById(id: number) {
    return this.prisma.home.findUnique({
      where: { id },
    });
  }
  constructor(private readonly prisma: PrismaService) {}

  async getHomes(filter: GetHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prisma.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        images: {
          select: { url: true },
          take: 1,
        },
      },
      where: filter,
    });
    if (!homes.length) {
      throw new NotFoundException('No homes found with the provided filters');
    }
    return homes.map((home) => {
      const { images, ...rest } = home;
      const fetchHome = { ...rest, image: images[0]?.url };
      return new HomeResponseDto(fetchHome);
    });
  }
  async createHome(
    {
      address,
      numberOfBathrooms,
      numberOfBedrooms,
      city,
      landSize,
      price,
      propertyType,
      images,
      realtorId,
    }: CreateHomeParams,
    userId: number,
  ): Promise<HomeResponseDto> {
    const home = await this.prisma.home.create({
      data: {
        address,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        city,
        price,
        land_size: landSize,
        propertyType,
        realtor_id: userId,
        images: {
          create: images.map(({ url }) => ({ url })),
        },
      },
    });
    return new HomeResponseDto(home);
  }

  /**
   * Deletes a home and its related images by home ID.
   */
  async deleteHomeById(id: number): Promise<void> {
    // delete all related images
    await this.prisma.image.deleteMany({
      where: { home_id: id },
    });

    // delete the home
    await this.prisma.home.delete({
      where: { id },
    });
  }
  async getRealtorByHomeId(id: number) {
    const realtor = await this.prisma.home.findUnique({
      where: { id },
      select: {
        realtor: { select: { name: true, id: true, email: true, phone: true } },
      },
    });
    if (!realtor?.realtor) {
      throw new NotFoundException();
    }
    return realtor.realtor;
  }
}
