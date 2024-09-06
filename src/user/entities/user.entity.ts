import { Activity } from '../../activity/entities/activity.entity';
import { Category } from '../../category/entities/category.entity';
import { Goal } from '../../goal/entities/goal.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  // User entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 255, unique: true })
  username: string;
  @Column({ type: 'varchar', length: 255 })
  password: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
  @OneToMany(() => Goal, (goal) => goal.user)
  goals: Goal[];
}
