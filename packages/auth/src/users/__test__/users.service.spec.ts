import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from 'src/users/users.service';
import { DatabaseModule } from 'src/database/database.module';
import { usersProvider } from 'src/users/users.providers';
import { signUpUser } from 'src/.jest/utils';

describe('users.service (unit)', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
      providers: [UsersService, ...usersProvider],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  const user = {
    email: 'efg@efg.com',
    username: 'efg123',
    password: 'efg123',
    repeatPassword: 'efg123',
  };

  it('create(): Create user', async () => {
    await service.create(user);

    const { email, username } = await service.findOne({ email: user.email });

    expect(email).toEqual(user.email);
    expect(username).toEqual(user.username);
  });

  it('findOne(): Retrieve user', async () => {
    await service.create(user);

    const { email, username, password } = await service.findOne({
      email: user.email,
    });

    expect(email).toEqual(user.email);
    expect(username).toEqual(user.username);
    expect(password).toBeDefined();
  });

  it('existingUser(): Retrieve existing user', async () => {
    await service.create(user);

    const caseOne = await service.existingUser({
      email: user.email,
    });

    expect(caseOne).toBeDefined();

    const caseTwo = await service.existingUser({
      username: user.username,
    });

    expect(caseTwo).toBeDefined();
  });

  describe('findOneByUsernameOrEmail()', () => {
    it('Email: Retrieve user', async () => {
      await service.create(user);

      const { email, username } = await await service.findOneByUsernameOrEmail(
        user.email,
      );

      expect(email).toEqual(user.email);
      expect(username).toEqual(user.username);
    });

    it('Username: Retrieve user', async () => {
      await service.create(user);

      const { email, username } = await await service.findOneByUsernameOrEmail(
        user.username,
      );

      expect(email).toEqual(user.email);
      expect(username).toEqual(user.username);
    });
  });

  it('existingUser(): Update and retrieve updated user', async () => {
    const { _id } = await signUpUser(user);

    const updates = { email: 'newEmail@newEmail.com', username: 'newUsername' };

    const { email, username } = await service.findByIdAndUpdate(_id, updates);

    expect(email).toEqual(updates.email);
    expect(username).toEqual(updates.username);
  });
});
