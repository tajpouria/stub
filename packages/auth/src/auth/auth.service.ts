import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/interfaces/user.interface';
import { JwtPayload, SessionObj } from 'src/interfaces/session';

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

  signIn(user: User, req: Express.Request) {
    const payload: JwtPayload = {
      username: user.username,
      sub: user._id,
      iat: Date.now(),
    };

    const session = this.jwtService.sign(payload);
    req.session = { session } as SessionObj;
    return { session };
  }

  async findUserByJwtPayload(payload: JwtPayload) {
    return await this.userService.findOne({ username: payload.username });
  }
}
