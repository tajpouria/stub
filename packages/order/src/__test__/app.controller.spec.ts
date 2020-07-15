import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  HttpMessage,
  cookieGeneratorFactory,
  produceObjectVariable,
} from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';

const { SESSION_NAME, JWT_SECRET } = process.env;

describe('app.controller (e2e)', () => {
  let app: INestApplication,
    orderRepository: Repository<OrderEntity>,
    ticketRepository: Repository<TicketEntity>;

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

    orderRepository = getConnection().getRepository(OrderEntity);
    ticketRepository = getConnection().getRepository(TicketEntity);
  });

  afterEach(async () => {
    await orderRepository.query(`DELETE FROM order_entity;`);
    await ticketRepository.query(`DELETE FROM ticket_entity;`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Hello Order! (/api/order)', () => {
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

  describe('POST /graphql', () => {
    describe('query orders', () => {
      it('Unauthorized: Unauthorized', async () => {
        const query = `
          {
            orders {
              id
            }
          }
        `;

        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('orders', async () => {
        const query = `
          {
            orders {
              id
            }
          }
        `;

        const response = await gCall(query, generateCookie());
        expect(response.body.data).not.toBeNull();
        expect(response.body.data.orders.length).toBeDefined();
      });
    });
  });

  describe('query order(id)', () => {
    it('Unauthorized: Unauthorized', async () => {
      const query = `
          {
            order(id: "abc1") {
              id
            }
          }
        `;

      const response = await gCall(query);
      expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
    });

    it('Document not exists: Not Found', async () => {
      const query = `
          {
            order(id: "abc1") {
              id
            }
          }
        `;

      const response = await gCall(query, generateCookie());
      expect(response.body.errors[0].message).toBe(HttpMessage.NOT_FOUND);
    });

    it('Not Document Owner: Forbidden', async () => {
      const ticketVars = {
        id: 'ticketID',
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
      };

      const orderVars = {
        expiresAt: new Date().toUTCString(),
        userId: 'randomId',
        ticket: ticketRepository.create(ticketVars),
      };

      const doc = await orderRepository.save(orderRepository.create(orderVars));

      const query = `
        {
          order(id: "${doc.id}") {
            id
          }
        }
      `;

      const response = await gCall(query, generateCookie());
      expect(response.body.errors[0].message).toBe(HttpMessage.FORBIDDEN);
    });

    it('Order', async () => {
      const ticketVars = {
        id: 'ticketID',
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
      };

      const userId = 'userId';

      const orderVars = {
        expiresAt: new Date().toUTCString(),
        userId,
        ticket: ticketRepository.create(ticketVars),
      };

      const doc = await orderRepository.save(orderRepository.create(orderVars));

      const query = `
        {
          order(id: "${doc.id}") {
            id
            userId
            ticket {
              id
            }
          }
        }
      `;

      const response = await gCall(
        query,
        generateCookie({
          iat: Date.now(),
          username: 'username',
          sub: userId,
        }),
      );

      expect(response.body.data.order.id).toBeDefined();
      expect(response.body.data.order.userId).toBe(userId);
      expect(response.body.data.order.ticket.id).toBe(ticketVars.id);
    });
  });
});
