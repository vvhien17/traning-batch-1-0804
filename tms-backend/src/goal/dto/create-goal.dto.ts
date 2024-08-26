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
  @IsDate({ message: `StartedTime ${ErrorMessage.INVALID_DATE}` })
  @IsNotEmpty({ message: `StartedTime ${ErrorMessage.IS_REQUIRED}` })
  startedTime: Date;

  @ApiProperty({})
  @IsDate({ message: `EndTime ${ErrorMessage.INVALID_DATE}` })
  @IsNotEmpty({ message: `EndTime ${ErrorMessage.IS_REQUIRED}` })
  endedTime: Date;

  // @ApiProperty({})
  // @IsNotEmpty()
  // @IsString()
  // status: string;
}
