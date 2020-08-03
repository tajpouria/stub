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
  JwtPayload,
} from '@tajpouria/stub-common';
import cookieSession from 'cookie-session';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
// __mocks__
import { stan } from 'src/shared/stan';
import { stripe } from 'src/charges/shared/stripe';

const { NAME, SESSION_NAME, JWT_SECRET } = process.env;

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

  describe(`Hello ${NAME}! (/api/${NAME})`, () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get(`/api/${NAME}`)
        .expect(200);
    });
  });

  const gCall = (query: string, cookie = ['']) =>
    request(app.getHttpServer())
      .post(`/api/${NAME}/graphql`)
      .set('Cookie', cookie)
      .send({
        operationName: null,
        query,
      });

  const generateCookie = cookieGeneratorFactory(SESSION_NAME, JWT_SECRET);

  describe('POST /graphql', () => {
    describe('query charges', () => {
      it('Unauthorized: Unauthorized', async () => {
        const query = `
              {
                charges{
                  id
                }
              }
            `;
        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Charges', async () => {
        const query = `
              {
                charges{
                  id
                }
              }
            `;
        const response = await gCall(query, generateCookie());
        expect(response.body.data).not.toBeNull();
        expect(response.body.data.charges.length).toBeDefined();
      });
    });

    describe('query charge(id)', () => {
      let doc: ChargeEntity;
      beforeEach(async () => {
        const order = await orderRepository.save(
          orderRepository.create({
            price: 1300,
            status: OrderStatus.Created,
            userId: v4(),
          }),
        );

        doc = await chargeRepository.save(
          chargeRepository.create({
            userId: order.userId,
            order,
          }),
        );
      });

      it('Unauthorized: Unauthorized', async () => {
        const query = `
                {
                  charge(id: "abc1") {
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
                  charge(id: "abc1") {
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
        const query = `
              {
                charge(id: "${doc.id}") {
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
        const query = `
              {
                charge(id: "${doc.id}") {
                  id
                  userId
                  order {
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
            sub: doc.userId,
          }),
        );

        expect(response.body.data.charge.id).toBeDefined();
        expect(response.body.data.charge.userId).toBe(doc.userId);
        expect(response.body.data.charge.order.id).toBe(doc.order.id);
      });
    });

    describe('mutation createStripCharge', () => {
      let order: OrderEntity;
      beforeEach(async () => {
        order = await orderRepository.save(
          orderRepository.create({
            price: 1300,
            status: OrderStatus.Created,
            userId: v4(),
          }),
        );
      });

      it('Unauthorized: Unauthorized', async () => {
        const vars = {
          orderId: v4(),
          source: v4(),
        };
        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                  }
                }
              `;
        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Invalid orderId: BadRequest', async () => {
        const vars = {
          orderId: 'Invalid uuid',
          source: v4(),
        };
        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                  }
                }
              `;
        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid source: BadRequest', async () => {
        const vars = {
          orderId: 'Invalid uuid',
          source: '1', // Invalid source
        };
        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                  }
                }
              `;
        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Order not exists: NotFound', async () => {
        const vars = {
          orderId: v4(),
          source: v4(),
        };
        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
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
        const vars = {
          orderId: order.id,
          source: v4(),
        };

        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                  }
                }
              `;

        // Update document
        order.status = OrderStatus.Cancelled;
        order.version++;
        await orderRepository.save(order);

        expect(
          (await gCall(query, generateCookie())).body.errors[0].message,
        ).toBe(new ForbiddenException().message);
      });

      it('Order is in Cancelled or Complete State: BadRequest', async () => {
        const vars = {
          orderId: order.id,
          source: v4(),
        };

        const jwtPayload: JwtPayload = {
          sub: order.userId,
          iat: Date.now(),
          username: 'user-name',
        };

        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                  }
                }
              `;

        // Update document
        order.status = OrderStatus.Cancelled;
        order.version++;
        await orderRepository.save(order);

        expect(
          (await gCall(query, generateCookie(jwtPayload))).body.errors[0]
            .message,
        ).toBe(new BadRequestException().message);

        // Update document
        order.status = OrderStatus.Complete;
        order.version++;
        await orderRepository.save(order);

        expect(
          (await gCall(query, generateCookie(jwtPayload))).body.errors[0]
            .message,
        ).toBe(new BadRequestException().message);
      });

      describe('CreateStripeCharge', () => {
        it('Response and create Document', async () => {
          const vars = {
            orderId: order.id,
            source: v4(),
          };

          const jwtPayload: JwtPayload = {
            sub: order.userId,
            iat: Date.now(),
            username: 'user-name',
          };

          const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                    order {
                      id
                    }
                  }
                }
              `;
          // Check response
          const response = await gCall(query, generateCookie(jwtPayload));
          expect(response.body.data.createStripeCharge.id).toBeDefined();
          expect(response.body.data.createStripeCharge.order.id).toBe(order.id);

          // Check created document
          expect(
            await chargeRepository.findOne(
              response.body.data.createStripeCharge.id,
            ),
          ).toBeDefined();
        });

        it('Update order status', async () => {
          const vars = {
            orderId: order.id,
            source: v4(),
          };

          const jwtPayload: JwtPayload = {
            sub: order.userId,
            iat: Date.now(),
            username: 'user-name',
          };

          const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                    order {
                      id
                    }
                  }
                }
              `;
          await gCall(query, generateCookie(jwtPayload));

          expect((await orderRepository.findOne(order.id)).status).toBe(
            OrderStatus.Complete,
          );
        });
      });

      it('Stripe Charge', async () => {
        const vars = {
          orderId: order.id,
          source: v4(),
        };

        const jwtPayload: JwtPayload = {
          sub: order.userId,
          iat: Date.now(),
          username: 'user-name',
        };

        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                    order {
                      id
                    }
                  }
                }
              `;

        await gCall(query, generateCookie(jwtPayload));

        expect(stripe.charges.create).toHaveBeenCalled();
        expect(
          (stripe.charges.create as jest.Mock).mock.calls[0][0].source,
        ).toBe(vars.source);
      });

      it('Publish event', async () => {
        const vars = {
          orderId: order.id,
          source: v4(),
        };

        const jwtPayload: JwtPayload = {
          sub: order.userId,
          iat: Date.now(),
          username: 'user-name',
        };

        const query = `
                mutation {
                  createStripeCharge(createStripeChargeInput: ${produceObjectVariable(
                    vars,
                  )}) {
                    id
                    order {
                      id
                    }
                  }
                }
              `;

        await gCall(query, generateCookie(jwtPayload));

        expect(stan.instance.publish).toHaveBeenCalled();
        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
        ).toBe(order.id);
        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1])
            .version,
        ).toBe(2);
      });
    });
  });
});
