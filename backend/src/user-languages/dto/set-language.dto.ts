import { IsString, IsIn, IsOptional } from 'class-validator';

export class SetLanguageDto {
  @IsString()
  @IsIn(['en', 'zh', 'ja'])
  languageCode: string;

  @IsString()
  @IsOptional()
  @IsIn(['a0', 'a1', 'a2', 'b1', 'b2', 'c1', 'c2'])
  currentLevel?: string;
}
