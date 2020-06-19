import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/interfaces/user.interface';
import { JwtPayload, SessionObj } from 'src/interfaces/session';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(usernameOrEmail: string, password: string) {
    let currentUser = await this.usersService.findOneByUsernameOrEmail(
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

  signIn(
    { username, _id }: Pick<User, '_id' | 'username'>,
    req: Express.Request,
  ) {
    const payload: JwtPayload = {
      sub: _id,
      username,
      iat: Date.now(),
    };

    const session = this.jwtService.sign(payload);
    req.session = { session } as SessionObj;
    return { session };
  }

  signOut(req: Express.Request) {
    req.session = null;
    return;
  }

  async findUserByJwtPayload({ username }: Pick<JwtPayload, 'username'>) {
    return await this.usersService.findOne({ username });
  }
}
