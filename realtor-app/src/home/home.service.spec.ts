import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { HomeService, homeSelect } from './home.service';
import { NotFoundException } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';

const mockGetHomes = [
  {
    id: 1,
    address: '123 Main St',
    numberOfBedrooms: 3,
    numberOfBathrooms: 2,
    city: 'Springfield',
    listedDate: new Date(),
    price: 250000,
    landSize: 5000,
    propertyType: PropertyType.RESIDENTIAL,
    createdAt: new Date(),
    updatedAt: new Date(),
    realtorId: 1,
    image: 'src1',
  },
];
const mockGetHomesSnakeCase = [
  {
    id: 1,
    address: '123 Main St',
    city: 'Toronto',
    price: 1500000,
    property_type: PropertyType.RESIDENTIAL,
    number_of_bedrooms: 3,
    number_of_bathrooms: 2,
    image: 'src1',
    listedDate: new Date(),
    images: [{ url: 'src1' }],
  },
];
const mockImages = [
  {
    id: 1,
    url: 'src1',
  },
  {
    id: 2,
    url: 'src2',
  },
  {
    id: 3,
    url: 'src3',
  },
];
// Prisma-Service-Mock einmal definieren
const mockPrismaService = {
  home: {
    findMany: jest.fn().mockReturnValue(mockGetHomes),
    findUnique: jest.fn(),
    create: jest.fn().mockReturnValue(mockGetHomesSnakeCase[0]),
  },
  image: {
    createMany: jest.fn().mockReturnValue(mockImages),
  },
};

describe('HomeService', () => {
  let service: HomeService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HomeService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<HomeService>(HomeService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('getHomes', () => {
    it('should call prisma home.findMany with correct params', async () => {
      const filters = {
        city: 'New Jersey',
        price: {
          gte: 400000,
          lte: 500000,
        },
        propertyType: PropertyType.RESIDENTIAL,
      };
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      const homes = await service.getHomes(filters);
      expect(mockPrismaFindManyHomes).toBeCalledWith({
        select: {
          ...homeSelect,
          images: {
            select: {
              url: true,
            },
            take: 1,
          },
        },
        where: filters,
      });
    });
  });

  it('should throw not found exception if no homes found', async () => {
    const filters = {
      city: 'Toronto',
      price: {
        gte: 1000000,
        lte: 3000000,
      },
      propertyType: PropertyType.RESIDENTIAL,
    };
    const mockPrismaFindManyHomes = jest.fn().mockReturnValue([]);
    jest
      .spyOn(prismaService.home, 'findMany')
      .mockImplementation(mockPrismaFindManyHomes);
    await expect(service.getHomes(filters)).rejects.toThrowError(
      NotFoundException,
    );
  });
  describe('createHome', () => {
    const userId = 28;
    const createHomeParams = {
      address: '123 Main St',
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      city: 'Toronto',
      price: 1500000,
      landSize: 5000,
      propertyType: PropertyType.RESIDENTIAL,
      images: [{ url: 'src1' }],
      realtorId: userId, // hier hinzufügen
    };

    it('should call prisma home.findMany with correct params', async () => {
      // Destructure, damit die Shorthands weiter unten funktionieren
      const {
        address,
        numberOfBathrooms,
        numberOfBedrooms,
        city,
        price,
        landSize,
        propertyType,
        images,
        realtorId, // hier mit destrukturieren
      } = createHomeParams;

      const mockCreateHome = jest
        .fn()
        .mockReturnValue(mockGetHomesSnakeCase[0]);
      jest
        .spyOn(prismaService.home, 'create')
        .mockImplementation(mockCreateHome);

      const result = await service.createHome(createHomeParams, 28);

      expect(mockCreateHome).toBeCalledWith({
        data: {
          address,
          number_of_bathrooms: numberOfBathrooms,
          number_of_bedrooms: numberOfBedrooms,
          city,
          price,
          land_size: landSize,
          propertyType,
          realtor_id: realtorId,
          images: {
            create: images.map(({ url }) => ({ url })),
          },
        },
      });
      expect(result).toEqual(mockGetHomesSnakeCase[0]);
    });
  });

  it('should call prisma image.createMany with the correct payload', async () => {
    const mockCreateManyImage = jest.fn().mockReturnValue(mockImages);
    jest
      .spyOn(prismaService.image, 'createMany')
      .mockImplementation(mockCreateManyImage);
    const result = await service.createHome(createHomeParams, 28);
    expect(mockCreateManyImage).toBeCalledWith({
      data: [{ url: 'src1', home_id: mockGetHomesSnakeCase[0].id }],
    });
    expect(result).toEqual(mockGetHomesSnakeCase[0]);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
