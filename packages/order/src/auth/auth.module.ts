import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { jwtConstants } from 'src/auth/constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
