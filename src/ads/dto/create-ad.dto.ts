import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAdDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() description: string;
  @IsNumber() price: number;
  @IsString() @IsNotEmpty() category: string;
  @IsOptional() @IsString() subcategory?: string;
  @IsOptional() @IsString() location?: string;
  @IsOptional() @IsString() district?: string;
  @IsOptional() @IsString() plan?: string;
}