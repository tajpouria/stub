import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { jwtConstants } from 'src/auth/constants';
import { JwtPayload } from 'src/interfaces/session';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
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

function PassportCookieSessionExtractor(req: Express.Request) {
  return req?.session?.session ?? null;
}
