import { IsString, IsOptional, IsIn, MaxLength } from 'class-validator';

export class UpdateApiKeyDto {
  @IsOptional()
  @IsString()
  @IsIn(['active', 'rate_limited', 'invalid', 'error', 'disabled'])
  status?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  errorMessage?: string;
}
