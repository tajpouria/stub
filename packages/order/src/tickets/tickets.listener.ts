import { Injectable } from '@nestjs/common';
import {
  Logger,
  TicketCreatedEventData,
  StanListenerOnMessageCallback,
} from '@tajpouria/stub-common';

import { TicketsService } from 'src/tickets/tickets.service';
import { ticketCreatedListener } from 'src/tickets/shared/ticket-created-listener';

const { NAME, NODE_ENV } = process.env;

@Injectable()
export class TicketsListener {
  private readonly logger = Logger(`${process.cwd()}/logs/tickets-listener`);

  constructor(private readonly ticketsService: TicketsService) {
    const { onTicketCreated } = this;

    // Initialize listeners
    if (NODE_ENV !== 'test') {
      ticketCreatedListener.listen(NAME).onMessage(onTicketCreated);
    }
  }

  onTicketCreated: StanListenerOnMessageCallback<
    TicketCreatedEventData
  > = async (validationErrors, data, msg) => {
    const { logger, ticketsService } = this;

    if (validationErrors)
      return (
        NODE_ENV !== 'test' &&
        logger.error(JSON.stringify({ validationErrors, data }))
      );

    try {
      await ticketsService.createAndSaveOne(data);
      msg.ack();
    } catch (error) {
      logger.error(error);
    }
  };
}
