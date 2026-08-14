import { Certification } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAlumniDto {
  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  organization?: string;

  @IsOptional()
  @IsString()
  batch?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsEnum(Certification)
  certification?: Certification;
}
