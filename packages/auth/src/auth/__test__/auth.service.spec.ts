import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from 'src/auth/auth.service';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from 'src/auth/constants';
import { signUpUser } from 'src/.jest/utils';
import { LocalStrategy } from 'src/auth/local.strategy';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { GoogleStrategy } from 'src/auth/google.strategy';

describe('auth.service (unit)', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
          secret: jwtConstants.secret,
        }),
      ],
      providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('validateUser()', () => {
    const user = {
      email: 'abc@abc.com',
      username: 'abc123',
      password: 'abc123',
      repeatPassword: 'abc123',
    };

    it('Valid credentials: Retrieve user', async () => {
      await signUpUser(user);

      const { email, username } = await service.validateUser(
        user.email,
        user.password,
      );

      expect(email).toEqual(user.email);
      expect(username).toEqual(user.username);
    });

    it('Invalid credentials: Return null', async () => {
      await signUpUser(user);

      expect(
        await service.validateUser(user.email, 'Invalid Password'),
      ).toBeNull();
    });
  });

  it('signIn(): Return session', async () => {
    const user = {
      _id: 'id',
      username: 'abc123',
    };

    expect(
      await service.signIn(user, {} as Express.Request).session,
    ).toBeDefined();
  });

  it('findUserByJwtPayload(): Retrieve user', async () => {
    const user = {
      email: 'abc@abc.com',
      username: 'abc123',
      password: 'abc123',
      repeatPassword: 'abc123',
    };

    await signUpUser(user);

    const { username, email } = await service.findUserByJwtPayload({
      username: user.username,
    });

    expect(username).toEqual(user.username);
    expect(email).toEqual(user.email);
  });
});
