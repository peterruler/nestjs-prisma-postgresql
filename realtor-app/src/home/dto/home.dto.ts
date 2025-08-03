import { PropertyType } from '@prisma/client';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

export class HomeResponseDto {
  id: number;
  address: string;
  @Exclude()
  number_of_bedrooms: number;
  @Expose({ name: 'numberOfBedrooms' })
  numberOfBedrooms(): number {
    return this.number_of_bedrooms;
  }
  @Exclude()
  number_of_bathrooms: number;
  @Expose({ name: 'numberOfBathrooms' })
  numberOfBathrooms(): number {
    return this.number_of_bathrooms;
  }
  city: string;
  @Exclude()
  listed_date: Date;
  @Expose({ name: 'listedDate' })
  listedDate(): Date {
    return this.listed_date;
  }
  price: number;

  image: string;
  @Exclude()
  land_size: number;
  @Expose({ name: 'landSize' })
  landSize(): number {
    return this.land_size;
  }
  propertyType: PropertyType;
  @Exclude()
  created_at: Date;
  @Expose({ name: 'createdAt' })
  createdAt(): Date {
    return this.created_at;
  }
  @Exclude()
  updated_at: Date;
  @Expose({ name: 'updatedAt' })
  updatedAt(): Date {
    return this.updated_at;
  }
  @Exclude()
  realtor_id: number;
  @Expose({ name: 'realtorId' })
  realtorId(): number {
    return this.realtor_id;
  }
  constructor(partial: Partial<HomeResponseDto>) {
    Object.assign(this, partial);
  }
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}
export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  price: number;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  @IsNotEmpty()
  propertyType: PropertyType;

  @IsNumber()
  @IsPositive()
  realtorId: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  price: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsOptional()
  @IsEnum(PropertyType)
  @IsNotEmpty()
  propertyType: PropertyType;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  realtorId: number;
}

export class InquireDto {
  @IsString()
  @IsNotEmpty()
  message: string;
}
