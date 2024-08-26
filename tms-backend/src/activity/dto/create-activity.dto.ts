import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage } from '../../common/utils/message-const';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateActivityDto {
  @ApiProperty({})
  @IsOptional()
  categoryId?: number;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;

  // @IsDate()
  @ApiProperty({})
  @IsNotEmpty({ message: `StartedAt ${ErrorMessage.IS_REQUIRED}` })
  startedAt: Date;

  // @IsDate()
  @ApiProperty({})
  @IsNotEmpty({ message: `EndedAt ${ErrorMessage.IS_REQUIRED}` })
  endedAt: Date;

  @ApiProperty({})
  @IsOptional()
  description?: string;
}
