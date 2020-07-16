import { OrderCreatedPublisher } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderCreatedPublisher = new OrderCreatedPublisher(stan.instance);
