import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { config as envConfig } from 'dotenv';
import { ErrorMessage, SuccessMessage } from '../common/utils/message-const';
import { BaseResponse } from '../common/base-response/base-response.dto';

envConfig();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<BaseResponse> {
    const user = await this.userRepository.findOne({
      where: { email, password },
      select: ['id', 'email', 'username'],
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USERNAME_PASSWORD_INCORRECT);
    }
    const payload = { id: user.id, username: user.username, email: user.email };
    return {
      data: {
        access_token: await this.jwtService.signAsync(payload, {
          secret: process.env.SECRET_KEY,
        }),
        user,
      },
      isSuccess: true,
      message: SuccessMessage.LOGIN_SUCCESS,
    };
  }
}
