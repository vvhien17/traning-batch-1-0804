import { PartialType } from '@nestjs/swagger';
import { CreateGoalOnActivityDto } from './create-goal-on-activity.dto';

export class UpdateGoalOnActivityDto extends PartialType(
  CreateGoalOnActivityDto,
) {}
