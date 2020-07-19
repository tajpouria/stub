import { Injectable } from '@nestjs/common';
import {
  Logger,
  StanListenerOnMessageCallback,
  OrderCreatedEventData,
} from '@tajpouria/stub-common';

import { TicketsService } from 'src/tickets/tickets.service';
import { orderCancelledListener } from 'src/tickets/shared/order-cancelled-listener';
import { Ticket } from 'src/tickets/entity/ticket.entity';
import { TicketUpdatedStanEvent } from 'src/stan-events/entity/ticket-updated-stan-event.entity';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';

const { NAME, NODE_ENV } = process.env;

@Injectable()
export class TicketsListener {
  private readonly logger = Logger(`${process.cwd()}/logs/tickets-listener`);

  constructor(
    private readonly ticketsService: TicketsService,
    private readonly stanEventsService: StanEventsService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {
    const { onOrderCreated } = this;
    // Initialize listeners
    if (NODE_ENV !== 'test') {
      orderCancelledListener.listen(NAME).onMessage(onOrderCreated);
    }
  }

  onOrderCreated: StanListenerOnMessageCallback<OrderCreatedEventData> = async (
    validationErrors,
    data,
    msg,
  ) => {
    const {
      logger,
      ticketsService,
      stanEventsService,
      databaseTransactionService,
    } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      // Verify document existence
      const ticket = await ticketsService.findOne(data.ticket?.id);
      if (!ticket) throw new Error(`Ticket ${data.ticket?.id} not found`);

      // Update document
      ticket.lastOrderId = data.id;

      // Create event
      const { id, title, price, timestamp, userId, version } = ticket;
      const ticketUpdatedStanEvent = stanEventsService.createOneTicketUpdated({
        id,
        title,
        price,
        timestamp,
        userId,
        version: version + 1, // Document version will increment after update
      });

      // Save document and event in context of same database transaction
      await databaseTransactionService.process<
        [Ticket, TicketUpdatedStanEvent]
      >([
        [ticket, 'save'],
        [ticketUpdatedStanEvent, 'save'],
      ]);

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };
}
