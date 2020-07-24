import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { v4 } from 'uuid';
import { Message } from 'node-nats-streaming';
import { OrderCancelledEventData, OrderStatus } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { OrdersListener } from 'src/orders/orders.listener';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
// __mocks__
import { stan } from 'src/shared/stan';

describe('orders.listener (unit)', () => {
  let app: INestApplication,
    listener: OrdersListener,
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

  describe('onOrderExpired()', () => {
    let doc: OrderEntity;
    beforeEach(async () => {
      doc = await orderRepository.save(
        orderRepository.create({
          expiresAt: new Date().toISOString(),
          userId: 'user-id',
        }),
      );

      await ticketRepository.save(
        ticketRepository.create({
          id: v4(),
          title: 'hello',
          price: 99.99,
          timestamp: 1593781663193,
          userId: 'mock20%id',
          orders: [doc],
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

      await listener.onOrderExpired(mockValidationError, eventData, mockMsg);

      expect((await orderRepository.findOne(doc.id)).status).toBe(doc.status);
    });

    it('ValidationError: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderExpired(mockValidationError, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Document not exist: Not to Invoke message acknowledge', async () => {
      const { eventData } = setup({ orderId: 'Gibberish' });

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect(mockMsg.ack).not.toBeCalled();
    });

    it('Order is on complete state: Not to cancel the order', async () => {
      // Change the order status
      doc.status = OrderStatus.Complete;
      doc.version = 2;
      await orderRepository.save(doc);

      const { eventData } = setup();

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect((await orderRepository.findOne(doc.id)).status).toBe(
        OrderStatus.Complete,
      );
    });

    it('Order is on complete State: Not to publish event', async () => {
      // Change order status to completed
      doc.status = OrderStatus.Complete;
      doc.version = 2;
      await orderRepository.save(doc);

      const { eventData } = setup();

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect(stan.instance.publish).not.toBeCalled();
    });

    it('Order is on complete State: Invoke message acknowledge', async () => {
      // Change order status to completed
      doc.status = OrderStatus.Complete;
      doc.version = 2;
      await orderRepository.save(doc);

      const { eventData } = setup();

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });

    it('Update document', async () => {
      const { eventData } = setup();

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect((await orderRepository.findOne(doc.id)).status).toBe(
        OrderStatus.Cancelled,
      );
    });

    it('Invoke message acknowledge', async () => {
      const { eventData } = setup();

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect(mockMsg.ack).toBeCalled();
    });

    it('Publish event', async () => {
      const { eventData } = setup();

      await listener.onOrderExpired(null, eventData, mockMsg);

      expect(stan.instance.publish).toBeCalled();

      expect(
        JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
      ).toBe(doc.id);
      expect(
        JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1])
          .version,
      ).toBe(3);
    });
  });
});
