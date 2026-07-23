import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserLanguage } from './entities/user-language.entity';
import { UserLanguagesService } from './user-languages.service';
import { UserLanguagesController } from './user-languages.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UserLanguage])],
  controllers: [UserLanguagesController],
  providers: [UserLanguagesService],
  exports: [UserLanguagesService],
})
export class UserLanguagesModule {}
