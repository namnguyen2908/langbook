import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ApiKey } from './api-key.entity';

@Entity('api_providers')
export class ApiProvider {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 500, name: 'endpoint' })
  endpoint: string;

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'NOW()' })
  createdAt: Date;

  @OneToMany(() => ApiKey, (key) => key.provider)
  keys: ApiKey[];
}
