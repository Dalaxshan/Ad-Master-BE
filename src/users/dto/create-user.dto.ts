import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsOptional() @IsString() firstName?: string;
  @IsOptional() @IsString() lastName?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() district?: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phoneNumber?: string;
  @IsOptional() @IsString() @MinLength(6) password?: string;
  @IsOptional() @IsString() googleId?: string;
  @IsOptional() @IsString() avatar?: string;
  @IsOptional() @IsString() provider?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() role?: string;
}
