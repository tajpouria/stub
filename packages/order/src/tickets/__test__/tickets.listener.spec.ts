import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Message } from 'node-nats-streaming';

import { TicketsListener } from 'src/tickets/tickets.listener';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { AppModule } from 'src/app.module';
import { async } from 'rxjs';

describe('tickets.listener (unit)', () => {
  let app: INestApplication,
    listener: TicketsListener,
    repository: Repository<TicketEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(TicketEntity);

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

    it('ValidationError: Not create document', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(mockValidationError, eventData, mockMsg);

      expect(await repository.findOne(eventData.id)).toBeUndefined();
    });

    it('ValidationError: Not Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Create document', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(null, eventData, mockMsg);

      const doc = await repository.findOne(eventData.id);

      expect(doc.id).toBe(eventData.id);
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onTicketCreated(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });
  });
});
