import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('user_languages')
export class UserLanguage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'language_code' })
  languageCode: string;

  @Column({ name: 'current_level', default: 'a0' })
  currentLevel: string;

  @Column({ name: 'daily_limit', default: 5 })
  dailyLimit: number;

  @Column({ name: 'daily_used', default: 0 })
  dailyUsed: number;

  @Column({ name: 'streak_days', default: 0 })
  streakDays: number;

  @Column({ name: 'total_xp', default: 0 })
  totalXp: number;

  @Column({ name: 'created_at', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ name: 'updated_at', default: () => 'NOW()' })
  updatedAt: Date;
}
