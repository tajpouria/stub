import { getConnection } from 'typeorm';

import { OrderEntity } from '../orders/entity/order.entity';
import { TicketEntity } from '../tickets/entity/ticket.entity';
import { OrderCreatedStanEvent } from '../stan-events/entity/order-created-stan-event.entity';
import { OrderCancelledStanEvent } from '../stan-events/entity/order-cancelled-stan-event.entity';

// @ts-ignore
jest.mock('../shared/stan');

// @ts-ignore
afterEach(async () => {
  // Restart mocks
  // @ts-ignore
  jest.clearAllMocks();

  // Database cleanup
  await getConnection()
    .getRepository(OrderEntity)
    .query(`DELETE FROM order_entity;`);

  await getConnection()
    .getRepository(TicketEntity)
    .query(`DELETE FROM ticket_entity;`);

  await getConnection()
    .getRepository(OrderCreatedStanEvent)
    .query(`DELETE FROM order_created_stan_event;`);

  await getConnection()
    .getRepository(OrderCancelledStanEvent)
    .query(`DELETE FROM order_cancelled_stan_event;`);
});
