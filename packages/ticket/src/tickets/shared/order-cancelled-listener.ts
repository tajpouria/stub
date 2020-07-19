import { OrderCancelledListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderCancelledListener = new OrderCancelledListener(stan.instance);
