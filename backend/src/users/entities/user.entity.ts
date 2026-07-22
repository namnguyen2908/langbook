import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'varchar', nullable: true })
  passwordHash: string | null;

  @Column({ type: 'varchar', nullable: true })
  name: string | null;

  @Column({ type: 'varchar', default: 'user' })
  role: string;

  @Column({ name: 'target_lang', type: 'varchar' })
  targetLang: string;

  @Column({ name: 'current_level', type: 'varchar', default: 'a0' })
  currentLevel: string;

  @Column({ name: 'placement_done', default: false })
  placementDone: boolean;

  @Column({ name: 'daily_limit', default: 5 })
  dailyLimit: number;

  @Column({ type: 'varchar', nullable: true })
  provider: string | null;

  @Column({ name: 'provider_id', type: 'varchar', nullable: true })
  providerId: string | null;

  @Column({ name: 'created_at', default: () => 'NOW()' })
  createdAt: Date;
}
