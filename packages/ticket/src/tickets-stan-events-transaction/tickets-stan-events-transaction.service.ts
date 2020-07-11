import { Injectable } from '@nestjs/common';
import { getManager } from 'typeorm';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { StanEvent } from 'src/stan-events/entity/stan-event.entity';

@Injectable()
export class TicketsStanEventsTransactionService {
  constructor() {}

  async saveTicketAndStanEventTransaction(
    ticket: Ticket,
    stanEvent: StanEvent,
  ): Promise<[Ticket, StanEvent]> {
    try {
      let createdTicket: Ticket, createdStanEvent: StanEvent;

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
