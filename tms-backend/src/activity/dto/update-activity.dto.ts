import { PartialType } from '@nestjs/mapped-types';
import { CreateActivityDto } from './create-activity.dto';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ErrorMessage } from '../../common/utils/message-const';
import { ApiProperty } from '@nestjs/swagger';

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
  @IsString()
  status?: string;
}
