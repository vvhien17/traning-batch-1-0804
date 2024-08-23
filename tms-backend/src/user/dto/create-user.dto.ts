// src/users/dto/create-user.dto.ts
import { ErrorMessage } from '../../common/utils/message-const';
import { IsString, IsEmail, Matches, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, {
    message: `${ErrorMessage.EMAIL_INVALID}`,
  })
  @IsNotEmpty({ message: `email ${ErrorMessage.IS_REQUIRED}` })
  email: string;

  @IsString()
  @IsNotEmpty({ message: `username ${ErrorMessage.IS_REQUIRED}` })
  username: string;

  @IsString()
  @IsNotEmpty({ message: `password ${ErrorMessage.IS_REQUIRED}` })
  password: string;
}
