// src/users/dto/create-user.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { ErrorMessage } from '../../common/utils/message-const';
import { IsString, IsEmail, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({})
  @IsEmail()
  @Matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, {
    message: `${ErrorMessage.EMAIL_INVALID}`,
  })
  @IsNotEmpty({ message: `email ${ErrorMessage.IS_REQUIRED}` })
  email: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: `username ${ErrorMessage.IS_REQUIRED}` })
  username: string;

  @ApiProperty({})
  @IsString()
  @IsNotEmpty({ message: `password ${ErrorMessage.IS_REQUIRED}` })
  password: string;
}
