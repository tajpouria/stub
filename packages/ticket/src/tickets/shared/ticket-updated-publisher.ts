import { TicketUpdatedPublisher } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const ticketUpdatedPublisher = new TicketUpdatedPublisher(stan.instance);
