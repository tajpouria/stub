import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import {
  INestApplication,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import request from 'supertest';
import {
  HttpMessage,
  cookieGeneratorFactory,
  produceObjectVariable,
} from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { OrderCreatedStanEvent } from 'src/stan-events/entity/order-created-stan-event.entity';
// __mocks__
import { stan } from 'src/shared/stan';

const { SESSION_NAME, JWT_SECRET } = process.env;

describe('app.controller (e2e)', () => {
  let app: INestApplication,
    orderRepository: Repository<OrderEntity>,
    ticketRepository: Repository<TicketEntity>,
    orderCreatedStanEvent: Repository<OrderCreatedStanEvent>;

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
    orderCreatedStanEvent = getConnection().getRepository(
      OrderCreatedStanEvent,
    );
  });

  afterEach(async () => {
    await ticketRepository.query(`DELETE FROM ticket_entity;`);
    await orderRepository.query(`DELETE FROM order_entity;`);
    await orderCreatedStanEvent.query(`DELETE FROM order_created_stan_event;`);
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

      it('Orders', async () => {
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
        expect(response.body.errors[0].message).toBe(
          new NotFoundException().message,
        );
      });

      it('Not Document Owner: Forbidden', async () => {
        const ticket = await ticketRepository.save(
          ticketRepository.create({
            id: 'ccd31c79-7bd2-4e23-9a62-5b8ef1aa41be',
            title: 'hello',
            price: 99.99,
            timestamp: 1593781663193,
            userId: 'mock20%id',
          }),
        );

        const order = await orderRepository.save(
          orderRepository.create({
            expiresAt: new Date().toUTCString(),
            userId: 'user-id',
            ticket,
          }),
        );

        const query = `
        {
          order(id: "${order.id}") {
            id
          }
        }
      `;

        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new ForbiddenException().message,
        );
      });

      it('Order', async () => {
        const ticket = await ticketRepository.save(
          ticketRepository.create({
            id: v4(),
            title: 'hello',
            price: 99.99,
            timestamp: 1593781663193,
            userId: 'mock20%id',
          }),
        );

        const userId = 'some-constants-id';

        const order = await orderRepository.save(
          orderRepository.create({
            expiresAt: new Date().toUTCString(),
            userId,
            ticket,
          }),
        );

        const query = `
        {
          order(id: "${order.id}") {
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
        expect(response.body.data.order.ticket.id).toBe(ticket.id);
      });
    });

    describe('mutation createOrder', () => {
      it('Unauthorized: Unauthorized', async () => {
        const vars = {
          ticketId: '123',
        };

        const query = `
            mutation {
              createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Invalid ticketId: BadRequest', async () => {
        const vars = {
          ticketId: 'Invalid uuid',
        };

        const query = `
            mutation {
              createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Ticket no exists: NotFound', async () => {
        const vars = {
          ticketId: v4(),
        };

        const query = `
            mutation {
              createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new NotFoundException().message,
        );
      });

      it('Ticket is Reserved : BadRequest', async () => {
        const ticket = await ticketRepository.save(
          ticketRepository.create({
            id: v4(),
            title: 'hello',
            price: 99.99,
            timestamp: 1593781663193,
            userId: 'mock20%id',
          }),
        );

        // Reserve ticket
        await orderRepository.save(
          orderRepository.create({
            expiresAt: new Date().toUTCString(),
            userId: 'some-id',
            ticket,
          }),
        );

        const vars = {
          ticketId: ticket.id,
        };

        const query = `
            mutation {
              createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new BadRequestException().message,
        );
      });

      it('CreateOrder', async () => {
        const ticket = await ticketRepository.save(
          ticketRepository.create({
            id: v4(),
            title: 'hello',
            price: 99.99,
            timestamp: 1593781663193,
            userId: 'mock20%id',
          }),
        );

        const vars = {
          ticketId: ticket.id,
        };

        const query = `
            mutation {
              createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
                id
                ticket {
                  id
                }
              }
            }
          `;
        const response = await gCall(query, generateCookie());

        expect(response.body.data.createOrder.id).toBeDefined();
        expect(response.body.data.createOrder.ticket.id).toBe(ticket.id);
      });

      it('Publish event', async () => {
        const ticket = await ticketRepository.save(
          ticketRepository.create({
            id: v4(),
            title: 'hello',
            price: 99.99,
            timestamp: 1593781663193,
            userId: 'mock20%id',
          }),
        );

        const vars = {
          ticketId: ticket.id,
        };

        const query = `
            mutation {
              createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
                id
                ticket {
                  id
                }
              }
            }
          `;

        await gCall(query, generateCookie());
        expect(stan.instance.publish).toHaveBeenCalled();
      });
    });
  });
});