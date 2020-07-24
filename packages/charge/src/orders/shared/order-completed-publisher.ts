import { OrderCompletedPublisher } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderCompletedPublisher = new OrderCompletedPublisher(
  stan.instance,
);
