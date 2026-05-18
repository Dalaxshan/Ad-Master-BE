import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() district?: string;
  @IsEmail() email: string;
  @IsString() @IsNotEmpty() phoneNumber: string;
  @IsString() @MinLength(6) password: string;
  @IsOptional() role?: string;
}
