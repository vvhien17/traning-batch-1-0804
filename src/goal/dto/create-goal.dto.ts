import { ErrorMessage } from '../../common/utils/message-const';
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsNotEmpty } from 'class-validator';
import {
  IsAfterOrEqualToday,
  IsAfterStartDate,
} from '../../common/utils/Utility';

export class CreateGoalDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;

  @ApiProperty({})
  @IsAfterOrEqualToday({
    message: `StartedTime ${ErrorMessage.INVALID_DATE} (must be today or later)`,
  })
  @IsDateString({}, { message: `StartedTime ${ErrorMessage.INVALID_DATE}` })
  @IsNotEmpty({ message: `StartedTime ${ErrorMessage.IS_REQUIRED}` })
  startedTime: string;

  @ApiProperty({})
  @IsAfterStartDate('startedTime', {
    message: `EndedTime ${ErrorMessage.INVALID_DATE} (must be later than start date)`,
  })
  @IsDateString({}, { message: `EndedTime ${ErrorMessage.INVALID_DATE}` })
  @IsNotEmpty({ message: `EndedTime ${ErrorMessage.IS_REQUIRED}` })
  endedTime: string;
}
