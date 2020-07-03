import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';
import { HttpMessage, generateCookie } from 'src/.jest/utils';
import { CreateTicketInput } from 'src/tickets/dto/create-ticket.dto';

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
              createTicket(createTicketInput: ${produceVariables(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Invalid title: Bad Request Exception', async () => {
        // Invalid Title
        let vars = {
          title: '',
          price: 99.99,
          latitude: 12.1,
          longitude: 14.2,
          timestamp: Date.now(),
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceVariables(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid price or timestamp or quantity: Bad Request Exception', async () => {
        // Invalid price
        let vars = {
          title: 'hello',
          price: 0,
          latitude: 12.1,
          longitude: 14.2,
          timestamp: Date.now(),
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceVariables(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid timestamp
        vars = Object.assign(vars, {
          price: '100',
          timestamp: 100,
        });

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid timestamp
        vars = Object.assign(vars, {
          price: '100',
          timestamp: Date.now(),
          quantity: 0,
        });

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid pictureURL or description or address: Bad Request Exception', async () => {
        // Invalid pictureURL
        let vars = {
          title: 'hello',
          price: 100,
          latitude: -12.1,
          longitude: 15.3,
          timestamp: Date.now(),
          pictureURL: 'abc',
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceVariables(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid description
        vars = Object.assign(vars, {
          pictureURL: 'https://google.com',
          description: '',
        });

        query = `
            mutation {
              createTicket(createTicketInput: ${produceVariables(vars)}) {
                id
              }
            }
          `;

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid address
        vars = Object.assign(vars, {
          pictureURL: 'https://google.com',
          description: 'valid description',
          address: '',
        });

        query = `
            mutation {
              createTicket(createTicketInput: ${produceVariables(vars)}) {
                id
              }
            }
          `;

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });
    });
  });
});
