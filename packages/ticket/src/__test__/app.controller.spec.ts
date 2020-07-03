import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';
import { HttpMessage, generateCookie } from 'src/.jest/utils';
import { CreateTicketDto } from 'src/tickets/dto/createTicket.dto';

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

  afterEach(async () => {
    await app.close();
  });

  describe('Hello Ticket! (/api/ticket)', () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get('/api/ticket')
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

  const produceVariables = (vars: Record<string, any>) =>
    JSON.stringify(vars).replace(/\"([^(\")"]+)\":/g, '$1:');

  describe('POST /graphql', () => {
    describe('query tickets', () => {
      it('Unauthorized: Unauthorized', async () => {
        const query = `
          {
            tickets {
              id
            }
          }
        `;

        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
        expect(response.body.data).toBeNull();
      });

      it('tickets', async () => {
        const query = `
          {
            tickets {
              id
            }
          }
        `;

        const response = await gCall(query, generateCookie());
        expect(response.body.data).not.toBeNull();
        expect(response.body.data.tickets.length).toBeDefined();
      });

      describe('mutation createTicket', () => {
        it('Unauthorized: Unauthorized', async () => {
          const vars = {
            title: 'hello',
            price: 99.99,
            latitude: 12.1,
            longitude: 14.2,
            timestamp: 1593781663193,
          };
          const query = `
            mutation {
              createTicket(createTicketDto: ${produceVariables(vars)}) {
                id
              }
            }
          `;
          const response = await gCall(query);
          expect(response.body.errors[0].message).toBe(
            HttpMessage.UNAUTHORIZED,
          );
          expect(response.body.data).toBeNull();
        });
      });
    });
  });
});
