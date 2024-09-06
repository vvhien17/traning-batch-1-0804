import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage } from '../../common/utils/message-const';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateActivityDto {
  @ApiProperty({
    description: 'CategoryId, this is optional',
  })
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    example: 'Activity name',
    description: 'Name of the activity',
  })
  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: `StartedAt ${ErrorMessage.IS_REQUIRED}` })
  startedAt: Date;

  @ApiProperty()
  @IsNotEmpty({ message: `EndedAt ${ErrorMessage.IS_REQUIRED}` })
  endedAt: Date;

  @ApiProperty({
    description: 'The description of the activity, this is optional',
  })
  @IsOptional()
  description?: string;
}
