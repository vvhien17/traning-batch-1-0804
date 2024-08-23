import { GoalOnActivity } from '../../goal-on-activity/entities/goal-on-activity.entity';
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
  name: string;
  @Column({ type: 'timestamp' })
  startedTime: Date;
  @Column({ type: 'timestamp' })
  endedTime: Date;
  @Column()
  status: string;
  @Column()
  userId: number;
  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;
  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
  @ManyToOne(() => User, (user) => user.goals)
  user: User;
  @OneToMany(() => GoalOnActivity, (goalOnActivity) => goalOnActivity.goal)
  goalOnActivities: GoalOnActivity[];
}
