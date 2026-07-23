import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ApiProvider } from './entities/api-provider.entity';
import { ApiKey } from './entities/api-key.entity';
import { ApiKeysService } from './api-keys.service';
import { ApiKeysController } from './api-keys.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ApiProvider, ApiKey])],
  controllers: [ApiKeysController],
  providers: [ApiKeysService],
  exports: [ApiKeysService],
})
export class ApiKeysModule {}
