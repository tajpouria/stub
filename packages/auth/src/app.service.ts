import { Injectable } from '@nestjs/common';
import { Cipher } from '@tajpouria/stub-common';

import { redis } from 'src/shared/redis';
import { mailer } from 'src/shared/mailer';

const { NAME, HOST, REDIS_EXPIRY_SECONDS } = process.env;

@Injectable()
export class AppService {
  getHello() {
    return { hello: NAME };
  }

  async redisStoreTokenData(data: Record<string, any>): Promise<string> {
    const strData = JSON.stringify(data);
    const token = await Cipher.hash(strData, {});
    await redis.set(token, strData, 'ex', +REDIS_EXPIRY_SECONDS);
    return token;
  }

  async redisRetrieveTokenData<T = any>(token: string): Promise<T | null> {
    const strData = await redis.get(token);
    return strData ? JSON.parse(strData) : null;
  }

  async redisDeleteTokenData(token: string) {
    return await redis.del(token);
  }

  generateConfirmLink(linkFor: 'signup' | 'forgotpassword', token: string) {
    return `${HOST}/auth/${linkFor}/${token}`;
  }

  async sendEmail(to: string, template: string) {
    const { MAILER, NAME } = process.env;

    mailer.sendMail({
      from: JSON.parse(MAILER).auth.user,
      to: to,
      subject: `Stub ${NAME}`,
      html: template,
    });
  }
}
