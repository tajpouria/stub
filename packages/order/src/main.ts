import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { objectContainsAll } from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';
import { stan } from 'src/shared/stan';

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
      'NATS_CLUSTER_ID',
      'NATS_CLIENT_ID',
      'NATS_URL',
      'ORDER_EXPIRATION_WINDOW_SECONDS',
    ],
    'Does not exists on process.env',
  );
  const {
    SESSION_NAME,
    NODE_ENV,
    PORT,
    NATS_CLUSTER_ID,
    NATS_CLIENT_ID,
    NATS_URL,
  } = process.env;

  try {
    await stan.connect({
      clusterID: NATS_CLUSTER_ID,
      clientID: NATS_CLIENT_ID,
      url: NATS_URL,
    });

    process.on('SIGTERM', () => stan.instance.close());
    process.on('SIGINT', () => stan.instance.close());
    stan.instance.on('close', () => process.exit(0));

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
  } catch (error) {
    console.error(error);
  }
}
bootstrap();
