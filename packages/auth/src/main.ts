import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { objectContainsAll } from '@tajpouria/stub-common/dist/common';
import cookieSession from 'cookie-session';

import { AppModule } from './app.module';

async function bootstrap() {
  try {
    objectContainsAll(
      process.env,
      ['NODE_ENV', 'NAME', 'VERSION', 'PORT', 'DB_URL', 'SESSION_NAME'],
      'Does not exists on process.env',
    );

    const { NAME, VERSION, PORT, SESSION_NAME } = process.env;

    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    const options = new DocumentBuilder()
      .setTitle(NAME)
      .setVersion(VERSION)
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api/users/document', app, document);

    app.disable('x-powered-by');
    app.useGlobalPipes(new ValidationPipe());
    app.use(
      cookieSession({
        name: SESSION_NAME,
        signed: false,
        httpOnly: true,
      }),
    );

    await app.listen(PORT);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
bootstrap();
