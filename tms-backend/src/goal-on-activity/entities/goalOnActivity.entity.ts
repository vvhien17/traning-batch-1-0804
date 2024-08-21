import { Activity } from '../../activity/entities/activity.entity';
import { Goal } from '../../goal/entities/goal.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity()
export class GoalOnActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  goalId: number;

  @Column()
  totalSpend: number; // Save in minutes

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Activity, (activity) => activity.goalOnActivities)
  activity: Activity;

  @ManyToOne(() => Goal, (goal) => goal.goalOnActivities)
  goal: Goal;
}
