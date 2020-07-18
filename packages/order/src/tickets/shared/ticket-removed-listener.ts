import { TicketRemovedListener } from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

export const ticketRemovedListener = new TicketRemovedListener(stan.instance);
