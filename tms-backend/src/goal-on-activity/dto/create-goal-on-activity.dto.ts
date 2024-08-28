import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsNotEmpty } from 'class-validator';
import { ErrorMessage } from '../../common/utils/message-const';

export class CreateGoalOnActivityDto {
  @ApiProperty()
  @IsNotEmpty({ message: `GoalId ${ErrorMessage.IS_REQUIRED}` })
  goalId: number;

  @ApiProperty()
  @IsInt({
    each: true,
    message: `Activity ${ErrorMessage.MUST_BE_ARRAY_INT}`,
  })
  @IsArray({ message: `Activity ${ErrorMessage.MUST_BE_ARRAY_INT}` })
  activityIds: number[];
}
