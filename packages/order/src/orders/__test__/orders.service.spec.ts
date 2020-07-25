import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { Repository, getConnection } from 'typeorm';

import { AppModule } from 'src/app.module';
import { OrdersService } from 'src/orders/orders.service';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';

describe('tickets.service (unit)', () => {
  let app: INestApplication,
    service: OrdersService,
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

    service = moduleFixture.get<OrdersService>(OrdersService);
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

  it('findAll(): Retrieve user orders', async () => {
    const orders = await service.findAll({ userId });

    expect(orders.length).toBeDefined();
    expect(orders[0].userId).toBe(userId);
    expect(orders[0].ticket.id).toBe(doc.ticket.id);
  });

  it('findOne(): Retrieve user order', async () => {
    const order = await service.findOne({ userId });

    expect(order.userId).toBe(userId);
    expect(order.ticket.id).toBe(doc.ticket.id);
  });

  it('createOne(): Create order template and inject id', async () => {
    const ticket = await ticketRepository.save(
      ticketRepository.create({
        id: v4(),
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
      }),
    );

    const newOrder = service.createOne({
      expiresAt: new Date().toUTCString(),
      userId,
      ticket,
    });

    expect(newOrder.id).toBeDefined();
    expect(newOrder.ticket.id).toBe(ticket.id);
  });

  it('saveOne(): Save document', async () => {
    const ticket = await ticketRepository.save(
      ticketRepository.create({
        id: v4(),
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
      }),
    );

    const newOrder = orderRepository.create({
      id: v4(),
      expiresAt: new Date().toUTCString(),
      userId,
      ticket,
    });

    await service.saveOne(newOrder);

    expect(await orderRepository.findOne(newOrder.id)).toBeDefined();
  });
});
