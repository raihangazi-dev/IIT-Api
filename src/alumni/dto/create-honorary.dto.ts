import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateHonoraryDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  designation: string;

  @IsString()
  @MinLength(1)
  organization: string;

  @IsOptional()
  @IsString()
  bio?: string;
}
