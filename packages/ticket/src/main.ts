import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { objectContainsAll } from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';

async function bootstrap() {
  objectContainsAll(
    process.env,
    [
      'NODE_ENV',
      'NAME',
      'HOST',
      'PORT',
      'SESSION_NAME',
      'JWT_SECRET',
      'ORM_CONFIG',
      'URL_PATTERN',
    ],
    'Does not exists on process.env',
  );
  const { SESSION_NAME, NODE_ENV, PORT } = process.env;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');
  app.use(
    cookieSession({
      name: SESSION_NAME,
      signed: false,
      httpOnly: true,
      secure: NODE_ENV === 'production',
    }),
  );

  await app.listen(PORT);
}
bootstrap();
