import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiProvider } from './entities/api-provider.entity';
import { ApiKey } from './entities/api-key.entity';
import { CreateApiProviderDto } from './dto/create-api-provider.dto';
import { UpdateApiProviderDto } from './dto/update-api-provider.dto';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { UpdateApiKeyDto } from './dto/update-api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(
    @InjectRepository(ApiProvider)
    private readonly providerRepo: Repository<ApiProvider>,
    @InjectRepository(ApiKey)
    private readonly keyRepo: Repository<ApiKey>,
  ) {}

  private makePreview(key: string): string {
    if (key.length <= 8) return key.substring(0, 4) + '****';
    return key.substring(0, 4) + '****' + key.substring(key.length - 4);
  }

  async createProvider(dto: CreateApiProviderDto): Promise<ApiProvider> {
    const exists = await this.providerRepo.findOneBy({ name: dto.name });
    if (exists) throw new ConflictException('Provider name already exists');

    const provider = this.providerRepo.create({ name: dto.name, endpoint: dto.endpoint ?? '' });
    return this.providerRepo.save(provider);
  }

  async listProviders(): Promise<ApiProvider[]> {
    return this.providerRepo.find({ order: { name: 'ASC' } });
  }

  async updateProvider(id: string, dto: UpdateApiProviderDto): Promise<ApiProvider> {
    const provider = await this.providerRepo.findOneBy({ id });
    if (!provider) throw new NotFoundException('Provider not found');

    if (dto.name !== undefined) provider.name = dto.name;
    if (dto.endpoint !== undefined) provider.endpoint = dto.endpoint;
    if (dto.isActive !== undefined) provider.isActive = dto.isActive;

    return this.providerRepo.save(provider);
  }

  async createKey(dto: CreateApiKeyDto): Promise<ApiKey> {
    const provider = await this.providerRepo.findOneBy({ id: dto.providerId });
    if (!provider) throw new NotFoundException('Provider not found');

    const key = this.keyRepo.create({
      providerId: dto.providerId,
      keyValue: dto.key,
      keyPreview: this.makePreview(dto.key),
    });
    return this.keyRepo.save(key);
  }

  async listKeys(providerId?: string): Promise<ApiKey[]> {
    const where = providerId ? { providerId } : {};
    return this.keyRepo.find({
      where,
      order: { createdAt: 'DESC' },
      relations: { provider: true },
    });
  }

  async updateKey(id: string, dto: UpdateApiKeyDto): Promise<ApiKey> {
    const key = await this.keyRepo.findOneBy({ id });
    if (!key) throw new NotFoundException('API key not found');

    if (dto.status !== undefined) key.status = dto.status;
    if (dto.errorMessage !== undefined) key.errorMessage = dto.errorMessage;

    return this.keyRepo.save(key);
  }

  async deleteKey(id: string): Promise<void> {
    const result = await this.keyRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('API key not found');
  }

  async selectKey(providerName: string): Promise<{ id: string; key: string } | null> {
    const keys = await this.keyRepo.find({
      where: {
        status: 'active',
        provider: { name: providerName, isActive: true },
      },
      relations: { provider: true },
      order: { lastCheckedAt: 'ASC' },
    });
    if (keys.length === 0) return null;

    const chosen = keys[0];
    return { id: chosen.id, key: chosen.keyValue };
  }

  async markError(id: string, status: string, errorMessage: string): Promise<void> {
    await this.keyRepo.update(id, {
      status,
      errorMessage,
      lastCheckedAt: new Date(),
    });
  }

  async markSuccess(id: string): Promise<void> {
    await this.keyRepo.update(id, {
      lastCheckedAt: new Date(),
    });
  }
}
