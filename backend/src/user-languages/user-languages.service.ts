import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserLanguage } from './entities/user-language.entity';
import { SetLanguageDto } from './dto/set-language.dto';

@Injectable()
export class UserLanguagesService {
  constructor(
    @InjectRepository(UserLanguage)
    private readonly repo: Repository<UserLanguage>,
  ) {}

  async findByUser(userId: string): Promise<UserLanguage[]> {
    return this.repo.find({ where: { userId }, order: { createdAt: 'ASC' } });
  }

  async add(userId: string, dto: SetLanguageDto): Promise<UserLanguage> {
    const existing = await this.repo.findOneBy({
      userId,
      languageCode: dto.languageCode,
    });
    if (existing) {
      throw new ConflictException('Ngôn ngữ này đã được thêm');
    }
    const record = this.repo.create({
      userId,
      languageCode: dto.languageCode,
      currentLevel: dto.currentLevel || 'a0',
    });
    return this.repo.save(record);
  }

  async update(
    userId: string,
    languageCode: string,
    dto: Partial<SetLanguageDto>,
  ): Promise<UserLanguage> {
    const record = await this.repo.findOneBy({ userId, languageCode });
    if (!record) {
      throw new NotFoundException('Không tìm thấy ngôn ngữ này');
    }
    if (dto.currentLevel) record.currentLevel = dto.currentLevel;
    record.updatedAt = new Date();
    return this.repo.save(record);
  }

  async remove(userId: string, languageCode: string): Promise<void> {
    const result = await this.repo.delete({ userId, languageCode });
    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy ngôn ngữ này');
    }
  }
}
