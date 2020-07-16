import { OrderCancelledPublisher } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderCancelledPublisher = new OrderCancelledPublisher(
  stan.instance,
);
