import { TicketCreatedListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const ticketCreatedListener = new TicketCreatedListener(stan.instance);
