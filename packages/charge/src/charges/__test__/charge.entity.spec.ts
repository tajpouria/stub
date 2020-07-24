import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { OrderStatus } from '@tajpouria/stub-common';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { ChargeEntity } from 'src/charges/entity/charge.entity';

describe('charge.entity (unit)', () => {
  let app: INestApplication,
    chargeRepository: Repository<ChargeEntity>,
    orderRepository: Repository<OrderEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    chargeRepository = getConnection().getRepository(ChargeEntity);
    orderRepository = getConnection().getRepository(OrderEntity);
  });

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

  afterAll(async () => {
    await app.close();
  });

  describe('Implements Optimistic concurrency control', () => {
    it('On skipping forward', async done => {
      const userId = v4();
      doc.userId = userId;
      // Skip forward
      doc.version = 5;

      try {
        await chargeRepository.save(doc);
      } catch (error) {
        expect((await chargeRepository.findOne(doc.id)).userId).not.toBe(
          userId,
        );

        return done();
      }

      throw new Error('Expect not to reach this point');
    });

    it('On skipping backward', async done => {
      const userId = v4();
      doc.userId = userId;
      // Skip backward
      doc.version = 0;

      try {
        await chargeRepository.save(doc);
      } catch (error) {
        expect((await chargeRepository.findOne(doc.id)).userId).not.toBe(
          userId,
        );

        return done();
      }

      throw new Error('Expect not to reach this point');
    });
  });

  it('Increment document.version onUpdate', async () => {
    expect(doc.version).toBe(1);

    doc.userId = v4();
    await chargeRepository.save(doc);
    expect(doc.version).toBe(2);

    doc.userId = v4();
    await chargeRepository.save(doc);
    expect(doc.version).toBe(3);
  });
});
