import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async login(
    userName: string,
    passWord: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersRepository.findOne({ where: { userName: userName } });
    if (!user) {
      throw new BadRequestException('User not found');
    }
    if (user?.passWord !== passWord) {
      throw new UnauthorizedException('UserName or password incorrect');
    }
    const payload = { id: user.id, username: user.userName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}