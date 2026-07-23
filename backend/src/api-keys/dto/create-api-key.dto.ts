import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateApiKeyDto {
  @IsUUID()
  @IsNotEmpty()
  providerId: string;

  @IsString()
  @IsNotEmpty()
  key: string;
}
