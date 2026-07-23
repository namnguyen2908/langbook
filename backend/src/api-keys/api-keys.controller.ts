import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { ApiKeysService } from './api-keys.service';
import { CreateApiProviderDto } from './dto/create-api-provider.dto';
import { UpdateApiProviderDto } from './dto/update-api-provider.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Get('api-providers')
  listProviders() {
    return this.apiKeysService.listProviders();
  }

  @Post('api-providers')
  createProvider(@Body() dto: CreateApiProviderDto) {
    return this.apiKeysService.createProvider(dto);
  }

  @Patch('api-providers/:id')
  updateProvider(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApiProviderDto,
  ) {
    return this.apiKeysService.updateProvider(id, dto);
  }

  @Get('api-keys')
  listKeys(@Query('provider_id') providerId?: string) {
    return this.apiKeysService.listKeys(providerId);
  }

  @Post('api-keys')
  createKey(@Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.createKey(dto);
  }

  @Patch('api-keys/:id')
  updateKey(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateApiKeyDto,
  ) {
    return this.apiKeysService.updateKey(id, dto);
  }

  @Delete('api-keys/:id')
  async deleteKey(@Param('id', ParseUUIDPipe) id: string) {
    await this.apiKeysService.deleteKey(id);
    return { success: true };
  }
}
