import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) { }

  async login(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      accountId: user.accountId.id,
    };

    return { token: this.jwtService.sign(payload) };
  }

  async validateUser(username: string, password: string) {
    let user: User;
    try {
      user = await this.usersService.findOneByUsername(username);
    } catch (error) {
      return null;
    }

    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
