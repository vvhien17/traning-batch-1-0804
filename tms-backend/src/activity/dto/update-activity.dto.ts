import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { ErrorMessage } from '../../common/utils/message-const';
import { ApiProperty } from '@nestjs/swagger';
import { ActivityStatus } from '../../common/constants/activity-status';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @ApiProperty({
    description: 'Id for activity',
  })
  @IsNumber()
  @IsNotEmpty({ message: `ID ${ErrorMessage.IS_REQUIRED}` })
  id: number;

  @ApiProperty({
    description: 'Status for activity',
  })
  @IsIn([
    ActivityStatus.COMPLETED,
    ActivityStatus.NOT_COMPLETED,
    ActivityStatus.CANCELED,
  ])
  @IsOptional()
  status?: string;

  @Max(1440, { message: ErrorMessage.REAL_SPEND_TIME_INVALID })
  @Min(1, {
    message: ErrorMessage.REAL_SPEND_TIME_INVALID,
  })
  @ValidateIf((o) => o.status === ActivityStatus.COMPLETED)
  realSpendTime?: number;
}
