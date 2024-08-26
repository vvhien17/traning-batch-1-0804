import { ErrorMessage } from '../../common/utils/message-const';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsDate,
} from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;

  @ApiProperty({})
  @IsDateString({}, { message: `StartedTime ${ErrorMessage.INVALID_DATE}` })
  @IsNotEmpty({ message: `StartedTime ${ErrorMessage.IS_REQUIRED}` })
  startedTime: string;

  @ApiProperty({})
  @IsDateString({}, { message: `EndTime ${ErrorMessage.INVALID_DATE}` })
  @IsNotEmpty({ message: `EndTime ${ErrorMessage.IS_REQUIRED}` })
  endedTime: string;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsString()
  // status: string;
}
