import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserLanguagesService } from './user-languages.service';
import { SetLanguageDto } from './dto/set-language.dto';

@Controller('user-languages')
@UseGuards(JwtAuthGuard)
export class UserLanguagesController {
  constructor(private readonly service: UserLanguagesService) {}

  @Get()
  list(@CurrentUser('id') userId: string) {
    return this.service.findByUser(userId);
  }

  @Post()
  add(@CurrentUser('id') userId: string, @Body() dto: SetLanguageDto) {
    return this.service.add(userId, dto);
  }

  @Patch(':languageCode')
  update(
    @CurrentUser('id') userId: string,
    @Param('languageCode') languageCode: string,
    @Body() dto: SetLanguageDto,
  ) {
    return this.service.update(userId, languageCode, dto);
  }

  @Delete(':languageCode')
  remove(
    @CurrentUser('id') userId: string,
    @Param('languageCode') languageCode: string,
  ) {
    return this.service.remove(userId, languageCode);
  }
}
