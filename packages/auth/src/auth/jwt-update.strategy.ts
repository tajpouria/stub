import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

import { jwtConstants } from 'src/auth/constants';
import { JwtPayload } from 'src/interfaces/session';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class JwtUpdateStrategy extends PassportStrategy(Strategy, 'jwt-auth') {
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
    const { authService } = this;

    if (!(await authService.canUpdateByJwtPayload(payload))) return null;

    return await authService.findUserByJwtPayload(payload);
  }
}

function PassportCookieSessionExtractor(req: Express.Request) {
  return req?.session?.updateUserSession ?? null;
}
