import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Message } from 'node-nats-streaming';
import { TicketRemovedEventData } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { TicketsListener } from 'src/tickets/tickets.listener';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { OrderEntity } from 'src/orders/entity/order.entity';

describe('tickets.listener (unit)', () => {
  let app: INestApplication,
    listener: TicketsListener,
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

    listener = moduleFixture.get<TicketsListener>(TicketsListener);
  });

  afterEach(async () => {
    await ticketRepository.query(`DELETE FROM ticket_entity;`);
    await orderRepository.query(`DELETE FROM order_entity;`);
  });

  afterAll(async () => {
    await app.close();
  });

  const mockMsg = ({ ack: jest.fn() } as unknown) as Message;
  const mockValidationError = [
    {
      dataPath: '',
      keyword: '',
      params: '',
      schemaPath: '',
    },
  ];

  describe('onTicketCreated()', () => {
    const setup = () => {
      const eventData = {
        id: v4(),
        title: 'hello',
        price: 99.99,
        timestamp: 1593781663193,
        userId: 'mock20%id',
        version: 1,
      };

      return { eventData };
    };

    it('ValidationError: Not to create document', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(mockValidationError, eventData, mockMsg);

      expect(await ticketRepository.findOne(eventData.id)).toBeUndefined();
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Create document', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(null, eventData, mockMsg);

      const doc = await ticketRepository.findOne(eventData.id);

      expect(doc.id).toBe(eventData.id);
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });
  });

  describe('onTicketUpdated()', () => {
    const eventData = {
      id: v4(),
      title: 'hello',
      price: 99.99,
      timestamp: 1593781663193,
      userId: 'mock20%id',
    };

    beforeEach(async () => {
      await ticketRepository.save(
        ticketRepository.create({ ...eventData, version: 1 }),
      );
    });

    it('ValidationError: Not to update document', async () => {
      await listener.onTicketUpdated(
        mockValidationError,
        { ...eventData, version: 2 },
        mockMsg,
      );

      expect((await ticketRepository.findOne(eventData.id)).version).toBe(1);
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      await listener.onTicketUpdated(
        mockValidationError,
        { ...eventData, version: 2 },
        mockMsg,
      );

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Skipping version: Not to update document', async () => {
      await listener.onTicketUpdated(
        null,
        { ...eventData, version: 3 }, // Skip version 2
        mockMsg,
      );

      expect((await ticketRepository.findOne(eventData.id)).version).toBe(1);
    });

    it('Skipping version: Not to Invoke message acknowledge', async () => {
      await listener.onTicketUpdated(
        null,
        { ...eventData, version: 3 }, // Skip version 2
        mockMsg,
      );

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Update document', async () => {
      await listener.onTicketUpdated(
        null,
        { ...eventData, version: 2 },
        mockMsg,
      );

      expect((await ticketRepository.findOne(eventData.id)).version).toBe(2);

      await listener.onTicketUpdated(
        null,
        { ...eventData, version: 3 },
        mockMsg,
      );

      expect((await ticketRepository.findOne(eventData.id)).version).toBe(3);
    });

    it('Invoke message acknowledge', async () => {
      await listener.onTicketUpdated(
        null,
        { ...eventData, version: 2 },
        mockMsg,
      );

      expect(mockMsg.ack).toBeCalled();
    });
  });

  describe('onTicketRemoved()', () => {
    let ticket: TicketEntity;

    beforeEach(async () => {
      ticket = await ticketRepository.save(
        ticketRepository.create({
          id: v4(),
          title: 'hello',
          price: 99.99,
          timestamp: 1593781663193,
          userId: 'mock20%id',
          version: 1,
        }),
      );
    });

    /**
     * Create mock order for provided ticket
     * @param t ticket
     */
    const setup = async (t: TicketEntity) => {
      const orderOne = await orderRepository.save(
        orderRepository.create({
          expiresAt: new Date().toUTCString(),
          userId: v4(),
          ticket: t,
        }),
      );

      const orderTwo = await orderRepository.save(
        orderRepository.create({
          expiresAt: new Date().toUTCString(),
          userId: v4(),
          ticket: t,
        }),
      );

      const eventData: TicketRemovedEventData = {
        id: ticket.id,
        version: ticket.version,
      };

      return { eventData, orderOne, orderTwo };
    };

    it('ValidationError: Not to remove document', async () => {
      const { eventData } = await setup(ticket);

      await listener.onTicketRemoved(mockValidationError, eventData, mockMsg);

      expect(await ticketRepository.findOne(eventData.id)).toBeDefined();
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      const { eventData } = await setup(ticket);

      await listener.onTicketRemoved(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Remove document', async () => {
      const { eventData } = await setup(ticket);

      await listener.onTicketRemoved(null, eventData, mockMsg);

      expect(await ticketRepository.findOne(eventData.id)).toBeUndefined();
    });

    it('Remove all orders that are associated with ticket', async () => {
      const { eventData, orderOne, orderTwo } = await setup(ticket);

      await listener.onTicketRemoved(null, eventData, mockMsg);

      expect(await ticketRepository.findOne(eventData.id)).toBeUndefined();
      expect(await orderRepository.findOne(orderOne.id)).toBeUndefined();
      expect(await orderRepository.findOne(orderTwo.id)).toBeUndefined();
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = await setup(ticket);

      await listener.onTicketRemoved(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });
  });
});
