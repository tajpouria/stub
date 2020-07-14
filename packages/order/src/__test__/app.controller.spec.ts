import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  HttpMessage,
  cookieGeneratorFactory,
  produceObjectVariable,
} from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';

const { SESSION_NAME, JWT_SECRET } = process.env;

describe('app.controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieSession({
        name: SESSION_NAME,
        signed: false,
        httpOnly: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Hello Ticket! (/api/ticket)', () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get('/api/order')
        .expect(200);
    });
  });

  const gCall = (query: string, cookie = ['']) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', cookie)
      .send({
        operationName: null,
        query,
      });

  const generateCookie = cookieGeneratorFactory(SESSION_NAME, JWT_SECRET);
});
