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
  OrderStatus,
} from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
// __mocks__
import { stan } from 'src/shared/stan';
import { ChargeEntity } from '../charges/entity/charge.entity';

const { SESSION_NAME, JWT_SECRET } = process.env;

describe('app.controller (e2e)', () => {
  let app: INestApplication,
    chargeRepository: Repository<ChargeEntity>,
    orderRepository: Repository<OrderEntity>;

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

    chargeRepository = getConnection().getRepository(ChargeEntity);
    orderRepository = getConnection().getRepository(OrderEntity);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Hello charge! (/api/charge)', () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get('/api/charge')
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
    it.todo('Hello');
    //   describe('query orders', () => {
    //     it('Unauthorized: Unauthorized', async () => {
    //       const query = `
    //         {
    //           orders {
    //             id
    //           }
    //         }
    //       `;
    //       const response = await gCall(query);
    //       expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
    //     });
    //     it('Orders', async () => {
    //       const query = `
    //         {
    //           orders {
    //             id
    //           }
    //         }
    //       `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.data).not.toBeNull();
    //       expect(response.body.data.orders.length).toBeDefined();
    //     });
    //   });
    //   describe('query order(id)', () => {
    //     it('Unauthorized: Unauthorized', async () => {
    //       const query = `
    //         {
    //           order(id: "abc1") {
    //             id
    //           }
    //         }
    //       `;
    //       const response = await gCall(query);
    //       expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
    //     });
    //     it('Document not exists: Not Found', async () => {
    //       const query = `
    //         {
    //           order(id: "abc1") {
    //             id
    //           }
    //         }
    //       `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(
    //         new NotFoundException().message,
    //       );
    //     });
    //     it('Not Document Owner: Forbidden', async () => {
    //       const order = await chargeRepository.save(
    //         chargeRepository.create({
    //           expiresAt: new Date().toUTCString(),
    //           userId: 'user-id',
    //         }),
    //       );
    //       await orderRepository.save(
    //         orderRepository.create({
    //           id: 'ccd31c79-7bd2-4e23-9a62-5b8ef1aa41be',
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [order],
    //         }),
    //       );
    //       const query = `
    //       {
    //         order(id: "${order.id}") {
    //           id
    //         }
    //       }
    //     `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(
    //         new ForbiddenException().message,
    //       );
    //     });
    //     it('Order', async () => {
    //       const userId = 'some-constants-id';
    //       const order = await chargeRepository.save(
    //         chargeRepository.create({
    //           expiresAt: new Date().toUTCString(),
    //           userId,
    //         }),
    //       );
    //       const ticket = await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [order],
    //         }),
    //       );
    //       const query = `
    //       {
    //         order(id: "${order.id}") {
    //           id
    //           userId
    //           ticket {
    //             id
    //           }
    //         }
    //       }
    //     `;
    //       const response = await gCall(
    //         query,
    //         generateCookie({
    //           iat: Date.now(),
    //           username: 'username',
    //           sub: userId,
    //         }),
    //       );
    //       expect(response.body.data.order.id).toBeDefined();
    //       expect(response.body.data.order.userId).toBe(userId);
    //       expect(response.body.data.order.ticket.id).toBe(ticket.id);
    //     });
    //   });
    //   describe('mutation createOrder', () => {
    //     it('Unauthorized: Unauthorized', async () => {
    //       const vars = {
    //         ticketId: '123',
    //       };
    //       const query = `
    //           mutation {
    //             createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query);
    //       expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
    //     });
    //     it('Invalid ticketId: BadRequest', async () => {
    //       const vars = {
    //         ticketId: 'Invalid uuid',
    //       };
    //       const query = `
    //           mutation {
    //             createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
    //     });
    //     it('Ticket not exists: NotFound', async () => {
    //       const vars = {
    //         ticketId: v4(),
    //       };
    //       const query = `
    //           mutation {
    //             createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(
    //         new NotFoundException().message,
    //       );
    //     });
    //     it('Ticket is Reserved : BadRequest', async () => {
    //       const order = await chargeRepository.save(
    //         chargeRepository.create({
    //           expiresAt: new Date().toUTCString(),
    //           userId: 'some-id',
    //         }),
    //       );
    //       // Reserve ticket
    //       const ticket = await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [order],
    //         }),
    //       );
    //       const vars = {
    //         ticketId: ticket.id,
    //       };
    //       const query = `
    //           mutation {
    //             createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(
    //         new BadRequestException().message,
    //       );
    //     });
    //     it('CreateOrder', async () => {
    //       const ticket = await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [],
    //         }),
    //       );
    //       const vars = {
    //         ticketId: ticket.id,
    //       };
    //       const query = `
    //           mutation {
    //             createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //               ticket {
    //                 id
    //               }
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.data.createOrder.id).toBeDefined();
    //       expect(response.body.data.createOrder.ticket.id).toBe(ticket.id);
    //     });
    //     it('Publish event', async () => {
    //       const ticket = await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [],
    //         }),
    //       );
    //       const vars = {
    //         ticketId: ticket.id,
    //       };
    //       const query = `
    //           mutation {
    //             createOrder(createOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //               ticket {
    //                 id
    //               }
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(stan.instance.publish).toHaveBeenCalled();
    //       expect(
    //         JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
    //       ).toBe(response.body.data.createOrder.id);
    //       expect(
    //         JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1])
    //           .version,
    //       ).toBe(1);
    //     });
    //   });
    //   describe('mutation cancelOrder', () => {
    //     it('Unauthorized: Unauthorized', async () => {
    //       const vars = {
    //         id: '123',
    //       };
    //       const query = `
    //           mutation {
    //             cancelOrder(cancelOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query);
    //       expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
    //     });
    //     it('Invalid id: BadRequest', async () => {
    //       const vars = {
    //         id: 'Invalid uuid',
    //       };
    //       const query = `
    //           mutation {
    //             cancelOrder(cancelOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
    //     });
    //     it('Order not exists: NotFound', async () => {
    //       const vars = {
    //         id: v4(),
    //       };
    //       const query = `
    //           mutation {
    //             cancelOrder(cancelOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(
    //         new NotFoundException().message,
    //       );
    //     });
    //     it('Not document owner: Forbidden', async () => {
    //       const order = await chargeRepository.save(
    //         chargeRepository.create({
    //           expiresAt: new Date().toUTCString(),
    //           userId: 'some-id',
    //         }),
    //       );
    //       // Reserve ticket
    //       await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [order],
    //         }),
    //       );
    //       const vars = {
    //         id: order.id,
    //       };
    //       const query = `
    //           mutation {
    //             cancelOrder(cancelOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //             }
    //           }
    //         `;
    //       const response = await gCall(query, generateCookie());
    //       expect(response.body.errors[0].message).toBe(
    //         new ForbiddenException().message,
    //       );
    //     });
    //     it('CancelOrder', async () => {
    //       const userId = 'user-id';
    //       const order = await chargeRepository.save(
    //         chargeRepository.create({
    //           expiresAt: new Date().toUTCString(),
    //           userId,
    //         }),
    //       );
    //       // Reserve ticket
    //       const ticket = await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [order],
    //         }),
    //       );
    //       const vars = {
    //         id: order.id,
    //       };
    //       const query = `
    //           mutation {
    //             cancelOrder(cancelOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //               status
    //             }
    //           }
    //         `;
    //       const response = await gCall(
    //         query,
    //         generateCookie({ iat: Date.now(), username: 'user', sub: userId }),
    //       );
    //       expect(response.body.data.cancelOrder.id).toBe(order.id);
    //       expect(response.body.data.cancelOrder.status).toBe(
    //         OrderStatus.Cancelled,
    //       );
    //     });
    //     it('Publish event', async () => {
    //       const userId = 'user-id';
    //       const order = await chargeRepository.save(
    //         chargeRepository.create({
    //           expiresAt: new Date().toUTCString(),
    //           userId,
    //         }),
    //       );
    //       // Reserve ticket
    //       await orderRepository.save(
    //         orderRepository.create({
    //           id: v4(),
    //           title: 'hello',
    //           price: 99.99,
    //           timestamp: 1593781663193,
    //           userId: 'mock20%id',
    //           orders: [order],
    //         }),
    //       );
    //       const vars = {
    //         id: order.id,
    //       };
    //       const query = `
    //           mutation {
    //             cancelOrder(cancelOrderInput: ${produceObjectVariable(vars)}) {
    //               id
    //               status
    //             }
    //           }
    //         `;
    //       await gCall(
    //         query,
    //         generateCookie({ iat: Date.now(), username: 'user', sub: userId }),
    //       );
    //       await gCall(query, generateCookie());
    //       expect(stan.instance.publish).toHaveBeenCalled();
    //       expect(
    //         JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
    //       ).toBe(order.id);
    //     });
    //   });
  });
});
