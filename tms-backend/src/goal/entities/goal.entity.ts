import { GoalOnActivity } from '../../goal-on-activity/entities/goalOnActivity.entity';
import { User } from '../../user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Goal {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  goalName: string;
  @Column('timestamp')
  goalStartedTime: Date;
  @Column('timestamp')
  goalEndedTime: Date;
  @Column()
  status: string;
  @Column()
  userId: number;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.goals)
  user: User;
  @OneToMany(() => GoalOnActivity, (goalOnActivity) => goalOnActivity.goal)
  goalOnActivities: GoalOnActivity[];
}
