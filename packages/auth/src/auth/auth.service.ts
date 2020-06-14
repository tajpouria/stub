import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOne({ email });

    if (user && (await Cipher.compare(user.password, password, {}))) {
      return user;
    }

    return null;
  }

  signIn(user: User) {
    const payload = { email: user.email, sub: user._id };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
