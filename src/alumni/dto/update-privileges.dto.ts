import { IsBoolean, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdatePrivilegesDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  certDiscountPercent?: number;

  @IsOptional()
  @IsString()
  freeCertifications?: string;

  @IsOptional()
  @IsBoolean()
  blogAccess?: boolean;

  @IsOptional()
  @IsBoolean()
  forumAccess?: boolean;
}
