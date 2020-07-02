import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { jwtConstants } from 'src/auth/constants';
import { JwtPayload } from 'src/interfaces/session';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        PassportCookieSessionExtractor,
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload) {
    return payload;
  }
}

function PassportCookieSessionExtractor(req: Express.Request) {
  return req?.session?.session ?? null;
}
