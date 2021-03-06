import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
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
      'VERSION',
      'PORT',
      'DB_URL',
      'SESSION_NAME',
      'JWT_SECRET',
      'GOOGLE_CLIENT_ID',
      'GOOGLE_CLIENT_SECRET',
      'REDIS_URL',
      'REDIS_EXPIRY_SECONDS',
      'MAILER',
      'USERNAME_PATTERN',
      'PASSWORD_PATTERN',
      'URL_PATTERN',
    ],
    'Does not exists on process.env',
  );

  const { NAME, VERSION, PORT, SESSION_NAME, NODE_ENV } = process.env;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle(NAME)
    .setVersion(VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/auth/document', app, document);

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
