import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async findByProvider(provider: string, providerId: string): Promise<User | null> {
    return this.usersRepository.findOneBy({
      provider: provider as 'google' | 'facebook',
      providerId,
    });
  }

  async createOAuthUser(data: {
    email: string;
    name: string;
    provider: 'google' | 'facebook';
    providerId: string;
    role?: string;
  }): Promise<User> {
    const user = this.usersRepository.create({
      email: data.email,
      name: data.name,
      provider: data.provider,
      providerId: data.providerId,
      role: data.role || 'user',
    });
    return this.usersRepository.save(user);
  }

  async updateProvider(
    id: string,
    provider: 'google' | 'facebook',
    providerId: string,
  ): Promise<void> {
    await this.usersRepository.update(id, { provider, providerId });
  }

  async updateRole(id: string, role: string): Promise<void> {
    await this.usersRepository.update(id, { role });
  }
}
