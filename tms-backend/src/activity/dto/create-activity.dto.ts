import { ErrorMessage } from '../../common/utils/message-const';
import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateActivityDto {
  @IsNumber()
  userId: number;

  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;

  @IsDate()
  @IsNotEmpty({ message: `StartedAt ${ErrorMessage.IS_REQUIRED}` })
  startedAt: Date;

  @IsDate()
  @IsNotEmpty({ message: `EndedAt ${ErrorMessage.IS_REQUIRED}` })
  endedAt: Date;

  @IsOptional()
  description?: string;
}
