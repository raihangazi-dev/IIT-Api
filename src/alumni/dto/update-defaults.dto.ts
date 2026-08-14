import { IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateDefaultsDto {
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  certDiscountPercent?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  blogDiscountPercent?: number;
}
