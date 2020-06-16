import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common/dist/crypto';

import { redis } from 'src/shared/redis';

const { HOST, REDIS_EXPIRY_SECONDS } = process.env;

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Auth!';
  }

  async redisStoreEmailToken(email: string): Promise<string> {
    const token = await Cipher.hash(email, {});
    redis.set(token, email, 'ex', +REDIS_EXPIRY_SECONDS);
    return token;
  }

  generateAuthLink(linkFor: 'singup' | 'forgotPassword', token: string) {
    return `${HOST}/api/auth/${linkFor}/${token}`;
  }
}
