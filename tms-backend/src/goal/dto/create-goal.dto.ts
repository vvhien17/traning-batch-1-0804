import { IsString, IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateGoalDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  startedTime: Date;

  @IsNotEmpty()
  @IsDateString()
  endedTime: Date;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
