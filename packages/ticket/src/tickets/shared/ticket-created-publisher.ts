import { TicketCreatedPublisher } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const ticketCreatedPublisher = new TicketCreatedPublisher(stan.instance);
