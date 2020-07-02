import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';

describe('app.controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const { SESSION_NAME } = process.env;

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

  const gCall = (query: string, cookie = ['']) =>
    request(app.getHttpServer())
      .post('/graphql')
      .set('Cookie', cookie)
      .send({
        operationName: null,
        query,
      });

  describe('Hello Ticket! (/api/ticket)', () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get('/api/ticket')
        .expect(200);
    });

    describe('POST /graphql', () => {
      describe('query ticket', () => {
        it('Unauthorized: 401', async () => {
          const query = `
            query {
              ticket {
                id
              }
            }
          `;

          const response = await gCall(query);
          expect(response.body.errors[0].extensions.exception.status).toBe(401);
        });

        it('200', async () => {});
      });
    });
  });
});
