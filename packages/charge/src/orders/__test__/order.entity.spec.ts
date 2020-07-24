import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { OrderStatus } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';

describe('tickets.entity (unit)', () => {
  let app: INestApplication, repository: Repository<OrderEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(OrderEntity);
  });

  let doc: OrderEntity;
  beforeEach(async () => {
    doc = await repository.save(
      repository.create({
        id: v4(),
        userId: 'user-id',
        price: Math.random(),
        status: OrderStatus.Created,
        version: 1,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Implements Optimistic concurrency control', () => {
    it('On skipping forward', async done => {
      const status = OrderStatus.Cancelled;
      doc.status = status;
      // Skip forward
      doc.version = 5;

      try {
        await repository.save(doc);
      } catch (error) {
        expect((await repository.findOne(doc.id)).status).not.toBe(status);

        return done();
      }

      throw new Error('Expect not to reach this point');
    });

    it('On skipping backward', async done => {
      const status = OrderStatus.Cancelled;
      doc.status = status;
      // Skip backward
      doc.version = 0;

      try {
        await repository.save(doc);
      } catch (error) {
        expect((await repository.findOne(doc.id)).status).not.toBe(status);

        return done();
      }

      throw new Error('Expect not to reach this point');
    });
  });

  it('Increment document.version onUpdate', async () => {
    expect(doc.version).toBe(1);

    doc.status = OrderStatus.Complete;
    await repository.save(doc);
    expect(doc.version).toBe(2);

    doc.status = OrderStatus.Cancelled;
    await repository.save(doc);
    expect(doc.version).toBe(3);
  });
});
