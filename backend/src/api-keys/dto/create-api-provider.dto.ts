import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';

export class CreateApiProviderDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  endpoint?: string;
}
