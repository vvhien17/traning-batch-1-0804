import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ErrorMessage } from '@/common/utils/message-const';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {
  @IsNumber()
  @IsNotEmpty({ message: `ID ${ErrorMessage.IS_REQUIRED}` })
  id: number;
}
