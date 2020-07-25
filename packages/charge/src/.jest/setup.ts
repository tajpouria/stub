import { getConnection } from 'typeorm';

import { OrderEntity } from '../orders/entity/order.entity';
import { ChargeEntity } from '../charges/entity/charge.entity';
import { OrderCompletedStanEvent } from '../stan-events/entity/order-completed-stan-event.entity';

// @ts-ignore
jest.mock('../shared/stan');
// @ts-ignore
jest.mock('../charges/shared/stripe');

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
    .getRepository(ChargeEntity)
    .query(`DELETE FROM charge_entity;`);

  await getConnection()
    .getRepository(OrderCompletedStanEvent)
    .query(`DELETE FROM order_completed_stan_event;`);
});
