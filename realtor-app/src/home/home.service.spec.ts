import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './../prisma/prisma.service';
import { PropertyType } from '@prisma/client';
import { HomeService, homeSelect } from './home.service';

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
    images: [{ url: 'src1' }],
  },
];

// Prisma-Service-Mock einmal definieren
const mockPrismaService = {
  home: {
    findMany: jest.fn().mockReturnValue(mockGetHomes),
    findUnique: jest.fn(),
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
        city: 'Toronto',
        price: {
          gte: 1000000,
          lte: 3000000,
        },
        propertyType: PropertyType.RESIDENTIAL,
      };
      const mockPrismaFindManyHomes = jest.fn().mockReturnValue(mockGetHomes);
      jest
        .spyOn(prismaService.home, 'findMany')
        .mockImplementation(mockPrismaFindManyHomes);

      const homes = await service.getHomes(filters);
      expect(mockPrismaFindManyHomes).toBeCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

