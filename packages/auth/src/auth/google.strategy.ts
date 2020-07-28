import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback, Profile } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, HOST } = process.env;

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${HOST}/api/auth/google/callback`,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ) {
    const { emails, photos } = profile;

    const user = {
      email: emails[0].value,
      username: emails[0].value,
      pictureURL: photos[0].value,
    };
    done(null, user);
  }
}
