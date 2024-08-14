import { Activity } from '../../activities/entities/activity.entity';
import { Category } from '../../categories/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class User {
  // User entity
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;
  @Column({ type: 'varchar', length: 255, unique: true })
  userName: string;
  @Column({ type: 'varchar', length: 255 })
  password: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];
  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];
}
