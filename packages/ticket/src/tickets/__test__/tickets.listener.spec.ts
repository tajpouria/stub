import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Message } from 'node-nats-streaming';
import { OrderCreatedEventData, OrderStatus } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { TicketsListener } from 'src/tickets/tickets.listener';
import { Ticket } from 'src/tickets/entity/ticket.entity';
// __mocks__
import { stan } from 'src/shared/stan';

describe('tickets.listener (unit)', () => {
  let app: INestApplication,
    listener: TicketsListener,
    repository: Repository<Ticket>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(Ticket);

    listener = moduleFixture.get<TicketsListener>(TicketsListener);
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM ticket_entity;`);
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

  describe('onOrderCreated()', () => {
    let doc: Ticket;
    beforeEach(async () => {
      doc = await repository.save(
        repository.create({
          id: v4(),
          title: 'hello',
          price: 99.99,
          timestamp: 1593781663193,
          userId: 'user-id',
          latitude: 1241.2,
          longitude: 124.4,
        }),
      );
    });

    const setup = ({ ticketId = doc.id }: { ticketId?: string } = {}) => {
      const eventData: OrderCreatedEventData = {
        id: v4(),
        expiresAt: new Date().toISOString(),
        status: OrderStatus.Created,
        userId: 'some-id',
        version: 1,
        ticket: {
          id: ticketId,
          price: doc.price,
          timestamp: doc.timestamp,
          title: doc.title,
          userId: doc.userId,
        },
      };

      return { eventData };
    };

    it('ValidationError: Not to create document', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(mockValidationError, eventData, mockMsg);

      expect((await repository.findOne(doc.id)).lastOrderId).toBeNull();
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Ticket not exist: Not to create document', async () => {
      const { eventData } = setup({ ticketId: 'Gibberish' });

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect((await repository.findOne(doc.id)).lastOrderId).toBeNull();
    });

    it('Ticket not exist: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup({ ticketId: 'Gibberish' });

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Update document', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect((await repository.findOne(doc.id)).lastOrderId).toBe(eventData.id);
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });

    it('Publish event', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect(stan.instance.publish).toBeCalled();
    });
  });
});
