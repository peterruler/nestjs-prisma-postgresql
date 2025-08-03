import { Test, TestingModule } from '@nestjs/testing';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { PrismaService } from '../prisma/prisma.service';
import { UnauthorizedException } from '@nestjs/common';
import { PropertyType } from '@prisma/client';
const mockUser = {
  id: 1,
  email: '7starch@gmail.com',
  phone: '0793057029',
};
const mockHome = {
  id: 11,
  city: 'Peter',
  phone: '0793057029',
  email: '7starch@gmail.com',
};
describe('HomeController', () => {
  let controller: HomeController;
  let homeService: HomeService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HomeController],
      providers: [
        {
          provide: HomeService,
          useValue: {
            getHomes: jest.fn().mockReturnValue([]),
            getRealtorByHomeId: jest
              .fn()
              .mockResolvedValue({ id: mockUser.id + 1 }), // andere ID
            updateHomeById: jest.fn().mockReturnValue(mockHome),
          },
        },
        PrismaService,
      ],
    }).compile();

    controller = module.get<HomeController>(HomeController);
    homeService = module.get<HomeService>(HomeService);
  });

  describe('getHomes', () => {
    it('should construct filter object correctly', async () => {
      const spyGetHomes = jest
        .spyOn(homeService, 'getHomes')
        .mockResolvedValue([]);

      await controller.getHomes('Berlin', '100000', '5000000', 'RESIDENTIAL');

      expect(spyGetHomes).toHaveBeenCalledWith({
        city: 'Berlin',
        price: { gte: 100000, lte: 5000000 },
        propertyType: PropertyType.RESIDENTIAL,
      });
    });
  });

  describe('updateHome', () => {
    const mockUserInfo = {
      id: 1,
      email: '7starch@gmail.com',
      phone: '0793057029',
      name: 'John Doe',
      iat: 1234567890,
      exp: 1234567890,
    };
    const mockCreateHomeParams = {
      address: '123 Main St',
      city: 'Berlin',
      numberOfBedrooms: 3,
      numberOfBathrooms: 2,
      listedDate: new Date(),
      price: 300000,
      image: 'image.jpg',
      landSize: 500,
      propertyType: PropertyType.RESIDENTIAL,
      realtorId: mockUser.id, // Added realtorId
    };
    it("should throw unauth error if realtor didn't create home", async () => {
      return await expect(
        controller.updateHome(2, mockCreateHomeParams, mockUserInfo),
      ).rejects.toThrowError(UnauthorizedException);
    });
  });
});
