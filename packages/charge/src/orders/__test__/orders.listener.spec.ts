import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Message } from 'node-nats-streaming';
import {
  OrderCancelledEventData,
  OrderStatus,
  OrderCreatedEventData,
} from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { OrdersListener } from 'src/orders/orders.listener';
import { OrderEntity } from 'src/orders/entity/order.entity';

describe('orders.listener (unit)', () => {
  let app: INestApplication,
    listener: OrdersListener,
    repository: Repository<OrderEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(OrderEntity);

    listener = moduleFixture.get<OrdersListener>(OrdersListener);
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
    const setup = () => {
      const eventData: OrderCreatedEventData = {
        id: v4(),
        expiresAt: new Date().toISOString(),
        version: 1,
        status: OrderStatus.Created,
        userId: 'some-id',
        ticket: {
          id: v4(),
          timestamp: Date.now(),
          title: 'some-title',
          price: 195.82,
          userId: 'some-id',
        },
      };

      return { eventData };
    };

    it('ValidationError: Not to create document', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(mockValidationError, eventData, mockMsg);

      expect(await repository.findOne(eventData.id)).toBeUndefined();
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Create document', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect(await repository.findOne(eventData.id)).toBeDefined();
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderCreated(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });
  });

  describe('onOrderCancelled()', () => {
    let doc: OrderEntity;
    beforeEach(async () => {
      doc = await repository.save(
        repository.create({
          id: v4(),
          price: Math.random(),
          status: OrderStatus.Created,
          version: 1,
          userId: 'user-id',
        }),
      );
    });

    const setup = ({ orderId = doc.id }: { orderId?: string } = {}) => {
      const eventData: OrderCancelledEventData = {
        id: orderId,
        version: 1,
      };

      return { eventData };
    };

    it('ValidationError: Not to update document', async () => {
      const { eventData } = setup();

      await listener.onOrderCancelled(mockValidationError, eventData, mockMsg);

      expect((await repository.findOne(doc.id)).status).toBe(doc.status);
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderCancelled(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Document not exist: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup({ orderId: 'Gibberish' });

      await listener.onOrderCancelled(null, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Update document', async () => {
      const { eventData } = setup();

      await listener.onOrderCancelled(null, eventData, mockMsg);

      expect((await repository.findOne(doc.id)).status).toBe(
        OrderStatus.Cancelled,
      );
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderCancelled(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });
  });
});
