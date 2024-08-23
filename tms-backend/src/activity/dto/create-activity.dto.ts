import { ErrorMessage } from '../../common/utils/message-const';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
export class CreateActivityDto {
  @IsOptional()
  categoryId?: number;

  @IsString()
  @IsNotEmpty({ message: `Name ${ErrorMessage.IS_REQUIRED}` })
  name: string;

  // @IsDate()
  @IsNotEmpty({ message: `StartedAt ${ErrorMessage.IS_REQUIRED}` })
  startedAt: Date;

  // @IsDate()
  @IsNotEmpty({ message: `EndedAt ${ErrorMessage.IS_REQUIRED}` })
  endedAt: Date;

  @IsOptional()
  description?: string;
}
