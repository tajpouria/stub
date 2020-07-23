import { OrderExpiredListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderExpiredListener = new OrderExpiredListener(stan.instance);
