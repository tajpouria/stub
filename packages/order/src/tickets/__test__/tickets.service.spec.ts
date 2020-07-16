import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';

import { TicketsService } from 'src/tickets/tickets.service';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';

describe('tickets.service (unit)', () => {
  let app: INestApplication,
    service: TicketsService,
    ticketRepository: Repository<TicketEntity>,
    orderRepository: Repository<OrderEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    ticketRepository = getConnection().getRepository(TicketEntity);
    orderRepository = getConnection().getRepository(OrderEntity);

    service = moduleFixture.get<TicketsService>(TicketsService);
  });

  afterEach(async () => {
    await ticketRepository.query(`DELETE FROM ticket_entity;`);
    await orderRepository.query(`DELETE FROM order_entity;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it('findOne(): Retrieve document', async () => {
    const doc = await ticketRepository.save(
      ticketRepository.create({
        id: v4(),
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
      }),
    );

    const ticket = await service.findOne(doc.id);

    expect(ticket.title).toBe(ticket.title);
  });

  it('createAndSaveOne(): Create, save and retrieve document', async () => {
    const doc = {
      id: v4(),
      title: 'hello',
      price: 99.99,
      timestamp: 1593781663193,
      userId: 'mock20%id',
    };

    await service.createAndSaveOne(doc);

    const ticket = await ticketRepository.findOne(doc.id);

    expect(ticket.id).toBe(doc.id);
  });

  describe('isReserved()', () => {
    it('Ticket not reserved: False', async () => {
      const ticket = await ticketRepository.save(
        ticketRepository.create({
          id: v4(),
          title: 'hello',
          price: 99.99,
          timestamp: 1593781663193,
          userId: 'mock20%id',
        }),
      );

      expect(await service.isReserved(ticket)).toBe(false);
    });

    it('Ticket reserved: True', async () => {
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
          userId: 'user-id',
          ticket,
        }),
      );

      expect(await service.isReserved(ticket)).toBe(true);
    });
  });
});
