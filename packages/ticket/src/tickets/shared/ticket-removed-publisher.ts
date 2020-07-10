import { TicketRemovedPublisher } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const ticketRemovedPublisher = new TicketRemovedPublisher(stan.instance);
