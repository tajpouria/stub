import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import {
  JwtPayload,
  PassportCookieSessionExtractor,
} from '@tajpouria/stub-common';

import { jwtConstants } from 'src/auth/constants';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        PassportCookieSessionExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return await this.authService.findUserByJwtPayload(payload);
  }
}
