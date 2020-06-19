import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { LocalStrategy } from 'src/auth/local.strategy';
import { jwtConstants } from 'src/auth/constants';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { GoogleStrategy } from 'src/auth/google.strategy';
import { JwtUpdateGuard } from 'src/auth/jwt-update.guard';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    JwtUpdateGuard,
    GoogleStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}
