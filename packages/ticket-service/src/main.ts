import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { objectContainsAll } from '@tajpouria/stub-common/dist/common';

async function bootstrap() {
  objectContainsAll(
    process.env,
    ['NODE_ENV', 'NAME', 'HOST', 'PORT', 'SESSION_NAME', 'JWT_SECRET'],
    'Does not exists on process.env',
  );
  const { PORT } = process.env;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.disable('x-powered-by');

  await app.listen(PORT);
}
bootstrap();
