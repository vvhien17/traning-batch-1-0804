import { GoalOnActivity } from '../../goal-on-activity/entities/goal-on-activity.entity';
import { Category } from '../../category/entities/category.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ActivityStatus } from '../../common/constants/activity-status';

@Entity()
export class Activity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ nullable: true })
  categoryId: number;
  @Column()
  name: string;
  @Column()
  userId: number;
  @Column({ type: 'timestamp' })
  startedAt: Date;
  @Column({ type: 'timestamp' })
  endedAt: Date;
  @Column({ nullable: true })
  realSpendTime: number; // save in minutes => hour and minute
  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;
  @Column({ default: ActivityStatus.NOT_COMPLETED })
  status: string;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @Column({ type: 'boolean', default: false })
  isDelete: boolean;
  @ManyToOne(() => Category, (category) => category.activities)
  category: Category;
  @ManyToOne(() => User, (user) => user.activities)
  user: User;
  @OneToMany(() => GoalOnActivity, (goalOnActivity) => goalOnActivity.activity)
  goalOnActivities: GoalOnActivity[];
}
