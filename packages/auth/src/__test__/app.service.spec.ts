import { Test, TestingModule } from '@nestjs/testing';

import { AppService } from 'src/app.service';
import { redis } from 'src/.jest/utils';

describe('app.service (unit)', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppService],
    }).compile();

    service = module.get<AppService>(AppService);
  });

  it('redisStoreTokenData(): Generate token and store data as string', async () => {
    const token = await service.redisStoreTokenData({ email: 'abc@abc.com' });

    const strData = await redis.get(token);

    expect(typeof strData === 'string');
    expect(strData).toBeDefined();
  });

  it('redisRetrieveTokenData(): Retrieve and parse stored data', async () => {
    const data = { email: 'abc@abc.com' };

    const token = await service.redisStoreTokenData(data);

    const parsedData = await service.redisRetrieveTokenData(token);

    expect(parsedData.email).toEqual(data.email);
  });

  it('redisDeleteTokenData(): delete token associated data', async () => {
    const data = { email: 'abc@abc.com' };

    const token = await service.redisStoreTokenData(data);

    await service.redisDeleteTokenData(token);

    const deletedData = await service.redisRetrieveTokenData(token);

    expect(deletedData).toBeNull();
  });

  it('generateConfirmLink(), Generate appropriate SIGN UP confirmation link', () => {
    const token = '123';
    const link = service.generateConfirmLink('signup', token);
    expect(link).toEqual(`${process.env.HOST}/auth/signup/${token}`);
  });

  it('generateConfirmLink(), Generate appropriate FORGOT PASSWORD confirmation link', () => {
    const token = '123';
    const link = service.generateConfirmLink('forgotpassword', token);
    expect(link).toEqual(
      `${process.env.HOST}/auth/forgotpassword/${token}`,
    );
  });
});
