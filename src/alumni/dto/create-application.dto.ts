import { Certification } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateApplicationDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsOptional()
  @IsString()
  linkedin?: string;

  @IsString()
  @MinLength(1)
  designation: string;

  @IsString()
  @MinLength(1)
  organization: string;

  @IsOptional()
  @IsString()
  yearsExperience?: string;

  @IsOptional()
  @IsString()
  careerStage?: string;

  @IsEnum(Certification)
  certification: Certification;

  @IsString()
  @MinLength(1)
  yearCompleted: string;
}
