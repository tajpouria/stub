import { OrderCreatedListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderCreatedListener = new OrderCreatedListener(stan.instance);
