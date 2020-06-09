import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from './app.module';

const { NAME = 'AUTH', VERSION = 'latest', PORT = '4000' } = process.env;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = new DocumentBuilder()
    .setTitle(NAME)
    .setVersion(VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/users/document', app, document);

  app.disable('x-powered-by');
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(PORT);
}
bootstrap();
