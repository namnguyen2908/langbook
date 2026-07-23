import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProvider } from './api-provider.entity';

@Entity('api_keys')
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', name: 'provider_id' })
  providerId: string;

  @Column({ type: 'text', name: 'key_value' })
  keyValue: string;

  @Column({ type: 'varchar', length: 20, name: 'key_preview' })
  keyPreview: string;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: string;

  @Column({ type: 'text', name: 'error_message', nullable: true })
  errorMessage: string | null;

  @Column({ type: 'timestamptz', name: 'last_checked_at', nullable: true })
  lastCheckedAt: Date | null;

  @Column({ type: 'timestamptz', name: 'created_at', default: () => 'NOW()' })
  createdAt: Date;

  @ManyToOne(() => ApiProvider, (provider) => provider.keys)
  @JoinColumn({ name: 'provider_id' })
  provider: ApiProvider;
}
