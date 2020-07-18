import { TicketUpdatedListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const ticketUpdatedListener = new TicketUpdatedListener(stan.instance);
