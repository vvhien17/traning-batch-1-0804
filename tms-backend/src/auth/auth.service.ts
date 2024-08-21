import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { ILoginResponse } from './dto/loginResponse.dto';
import { config as envConfig } from 'dotenv';
import { ErrorMessage } from '../common/utils/message-const';

envConfig();
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async login(email: string, password: string): Promise<ILoginResponse> {
    const user = await this.userRepository.findOne({
      where: { email, password },
    });

    if (!user) {
      throw new UnauthorizedException(ErrorMessage.USERNAME_PASSWORD_INCORRECT);
    }
    delete user.password;
    const payload = { id: user.id, username: user.username, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: process.env.SECRET_KEY,
      }),
      user,
    };
  }
}
