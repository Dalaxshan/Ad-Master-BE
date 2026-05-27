import {
  IsArray,
  IsNotEmpty,
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { plainToInstance, Transform, Type } from 'class-transformer';

export class BoostAdDto {
  @IsString() @IsNotEmpty() boost: string;
  @IsDate() @Type(() => Date) startDate: Date;
  @IsDate() @Type(() => Date) endDate: Date;
  @Transform(({ value }) => parseFloat(value)) @IsNumber() boostCharge: number;
}

export class PlanAdDto {
  @IsString() @IsNotEmpty() plan: string;
  @IsDate() @Type(() => Date) startDate: Date;
  @IsDate() @Type(() => Date) endDate: Date;
  @Transform(({ value }) => parseFloat(value)) @IsNumber() planCharge: number;
}

export class CreateAdDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() description: string;
  @Transform(({ value }) => parseFloat(value)) @IsNumber() price: number;
  @IsString() @IsNotEmpty() category: string;
  @IsOptional() @IsString() subcategory?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() district?: string;

  @IsOptional()
  @Transform(({ value }) => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return plainToInstance(PlanAdDto, parsed);
    } catch {
      return value;
    }
  })
  @ValidateNested()
  @Type(() => PlanAdDto)
  plan?: PlanAdDto;

  @IsOptional()
  @Transform(({ value }) => {
    try {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return plainToInstance(BoostAdDto, parsed);
    } catch {
      return value;
    }
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoostAdDto)
  boostAds?: BoostAdDto[];

  @IsOptional()
  @Transform(({ value }) => {
    try {
      return typeof value === 'string' ? JSON.parse(value) : value;
    } catch {
      return value;
    }
  })
  images?: { url: string; publicId: string }[];

  @Transform(({ value }) => parseFloat(value))
  @IsNumber()
  totalAmount?: number;
}
