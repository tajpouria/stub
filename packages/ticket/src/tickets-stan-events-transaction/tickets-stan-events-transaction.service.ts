import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';

@Injectable()
export class TicketsStanEventsTransactionService {
  constructor() {}

  async saveTicketAndStanEventTransaction(
    ticket: Ticket,
    stanEvent: TicketCreatedStanEvent,
  ): Promise<[Ticket, TicketCreatedStanEvent]> {
    try {
      let createdTicket: Ticket, createdStanEvent: TicketCreatedStanEvent;

      await getManager().transaction(async transactionalEntityManager => {
        createdTicket = await transactionalEntityManager.save(ticket);
        createdStanEvent = await transactionalEntityManager.save(stanEvent);
      });

      return [createdTicket, createdStanEvent];
    } catch (error) {
      throw new Error(error);
    }
  }
}
