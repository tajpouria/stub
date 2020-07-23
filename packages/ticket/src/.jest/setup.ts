import { getConnection } from 'typeorm';

import { Ticket } from '../tickets/entity/ticket.entity';
import { TicketCreatedStanEvent } from '../stan-events/entity/ticket-created-stan-event.entity';
import { TicketRemovedStanEvent } from '../stan-events/entity/ticket-removed-stan-event.entity';
import { TicketUpdatedStanEvent } from '../stan-events/entity/ticket-updated-stan-event.entity';

// @ts-ignore
jest.mock('../shared/stan');

// @ts-ignore
afterEach(async () => {
  // Restart mocks
  // @ts-ignore
  jest.clearAllMocks();

  // Database cleanup
  await getConnection()
    .getRepository(Ticket)
    .query(`DELETE FROM ticket;`);

  await getConnection()
    .getRepository(TicketCreatedStanEvent)
    .query(`DELETE FROM ticket_created_stan_event;`);

  await getConnection()
    .getRepository(TicketRemovedStanEvent)
    .query(`DELETE FROM ticket_removed_stan_event;`);

  await getConnection()
    .getRepository(TicketUpdatedStanEvent)
    .query(`DELETE FROM ticket_updated_stan_event;`);
});
