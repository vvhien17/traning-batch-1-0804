// src/users/dto/create-user.dto.ts
import { IsString, IsEmail, Length } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @Length(4, 255)
  userName: string;

  @IsString()
  @Length(6, 255)
  password: string;
}
