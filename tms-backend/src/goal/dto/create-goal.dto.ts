import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsInt, IsNotEmpty } from 'class-validator';

export class CreateGoalDto {
  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsDateString()
  startedTime: Date;

  @ApiProperty({})
  @IsNotEmpty()
  @IsDateString()
  endedTime: Date;

  @ApiProperty({})
  @IsNotEmpty()
  @IsString()
  status: string;

  @ApiProperty({})
  @IsNotEmpty()
  @IsInt()
  userId: number;
}
