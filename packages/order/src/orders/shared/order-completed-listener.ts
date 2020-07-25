import { OrderCompletedListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const orderCompletedListener = new OrderCompletedListener(stan.instance);
