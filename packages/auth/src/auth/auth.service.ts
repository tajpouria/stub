import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/interfaces/user.interface';
import { JwtPayload } from 'src/interfaces/session';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string) {
    let currentUser = await this.userService.findOneByUsernameOrEmail(
      usernameOrEmail,
    );

    if (
      currentUser?.password &&
      (await Cipher.compare(currentUser.password, password, {}))
    ) {
      return currentUser;
    }

    return null;
  }

  generateSession(user: User) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user._id,
      iat: Date.now(),
    };

    return this.jwtService.sign(payload);
  }

  async findUserByJwtPayload(payload: JwtPayload) {
    return await this.userService.findOne({ username: payload.username });
  }
}
