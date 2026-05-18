import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

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
  @IsNotEmpty() @ValidateNested() @Type(() => PlanAdDto) plan: PlanAdDto;
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BoostAdDto)
  boostAds?: BoostAdDto[];
}
