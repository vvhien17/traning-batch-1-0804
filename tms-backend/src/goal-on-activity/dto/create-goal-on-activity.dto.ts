import { ApiProperty } from '@nestjs/swagger';
import { CreateActivityDto } from '../../activity/dto/create-activity.dto';
import { IsNotEmpty } from 'class-validator';
import { ErrorMessage } from '../../common/utils/message-const';

export class CreateGoalOnActivityDto extends CreateActivityDto {
  @ApiProperty()
  @IsNotEmpty({ message: `GoalId ${ErrorMessage.IS_REQUIRED}` })
  goalId: number;
}
