import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { OrderStatus } from '@tajpouria/stub-common';

describe('tickets.entity (unit)', () => {
  let app: INestApplication,
    orderRepository: Repository<OrderEntity>,
    ticketRepository: Repository<TicketEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    orderRepository = getConnection().getRepository(OrderEntity);
    ticketRepository = getConnection().getRepository(TicketEntity);
  });

  let doc: OrderEntity;
  beforeEach(async () => {
    const ticket = await ticketRepository.save(
      ticketRepository.create({
        id: v4(),
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
      }),
    );

    doc = await orderRepository.save(
      orderRepository.create({
        expiresAt: new Date().toUTCString(),
        userId: 'user-id',
        ticket,
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
        await orderRepository.save(doc);
      } catch (error) {
        expect((await orderRepository.findOne(doc.id)).status).not.toBe(status);

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
        await orderRepository.save(doc);
      } catch (error) {
        expect((await orderRepository.findOne(doc.id)).status).not.toBe(status);

        return done();
      }

      throw new Error('Expect not to reach this point');
    });
  });

  it('Increment document.version onUpdate', async () => {
    expect(doc.version).toBe(1);

    doc.status = OrderStatus.Complete;
    await orderRepository.save(doc);
    expect(doc.version).toBe(2);

    doc.status = OrderStatus.Cancelled;
    await orderRepository.save(doc);
    expect(doc.version).toBe(3);
  });
});
