import { Category } from '../../categories/entities/category.entity';
import { User } from '../../users/entities/user.entity';
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
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  categoryId: number;
  @Column()
  name: string;
  @Column()
  userId: number;
  @Column({ type: 'timestamptz' })
  startedAt: Date;
  @Column({ type: 'timestamptz' })
  endedAt: Date;
  @Column({ type: 'varchar', length: 255 })
  description: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @Column({ type: 'boolean', default: false })
  isDelete: boolean;
  @ManyToOne(() => Category, (category) => category.activities)
  category: Category;
  @ManyToOne(() => User, (user) => user.activities)
  user: User;
}
