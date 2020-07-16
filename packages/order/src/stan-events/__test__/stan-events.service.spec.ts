import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, Repository } from 'typeorm';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { OrderEntity } from 'src/orders/entity/order.entity';

describe('stan-events.service (unit)', () => {
  let app: INestApplication,
    service: StanEventsService,
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

    service = moduleFixture.get<StanEventsService>(StanEventsService);
  });

  afterEach(async () => {
    await orderRepository.query(`DELETE FROM order_entity;`);
  });

  afterAll(async () => {
    await app.close();
  });

  const userId = 'user-id';
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
        userId,
        ticket,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('createOneOrderCreated(): Create orderCreatedStanEvent template', () => {
    const newRecord = service.createOneOrderCreated(doc);

    expect(newRecord.userId).toBe(doc.userId);
    expect(newRecord.expiresAt).toBe(doc.expiresAt);
    expect(newRecord.ticket.id).toBe(doc.ticket.id);
  });

  it('createOneOrderCancelled(): Create orderCancelledStanEvent template', () => {
    const newRecord = service.createOneOrderCancelled(doc);

    expect(newRecord.id).toBe(doc.id);
  });
});
