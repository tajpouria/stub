import { Injectable } from '@nestjs/common';
import {
  Logger,
  StanListenerOnMessageCallback,
  TicketCreatedEventData,
  TicketUpdatedEventData,
  TicketRemovedEventData,
  TicketCreatedListener,
  TicketUpdatedListener,
  TicketRemovedListener,
} from '@tajpouria/stub-common';

import { TicketsService } from 'src/tickets/tickets.service';
import { stan } from 'src/shared/stan';

const { NAME, NODE_ENV } = process.env;

@Injectable()
export class TicketsListener {
  private readonly logger = Logger(`${process.cwd()}/logs/tickets-listener`);

  constructor(private readonly ticketsService: TicketsService) {
    const { onTicketCreated, onTicketUpdated, onTicketRemoved } = this;
    // Initialize listeners
    if (NODE_ENV !== 'test') {
      new TicketCreatedListener(stan.instance)
        .listen(NAME)
        .onMessage(onTicketCreated);
      new TicketUpdatedListener(stan.instance)
        .listen(NAME)
        .onMessage(onTicketUpdated);
      new TicketRemovedListener(stan.instance)
        .listen(NAME)
        .onMessage(onTicketRemoved);
    }
  }

  onTicketCreated: StanListenerOnMessageCallback<
    TicketCreatedEventData
  > = async (validationErrors, data, msg) => {
    const { logger, ticketsService } = this;
    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      const { id, price, timestamp, title, userId, version } = data;
      await ticketsService.createAndSaveOne({
        id,
        version,
        userId,
        title,
        timestamp,
        price,
      });
      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };

  onTicketUpdated: StanListenerOnMessageCallback<
    TicketUpdatedEventData
  > = async (validationErrors, data, msg) => {
    const { logger, ticketsService } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      const { id, price, timestamp, title, userId, version } = data;
      await ticketsService.createAndSaveOne({
        id,
        price,
        version,
        userId,
        title,
        timestamp,
      });
      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };

  onTicketRemoved: StanListenerOnMessageCallback<
    TicketRemovedEventData
  > = async (validationErrors, data, msg) => {
    const { logger, ticketsService } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      // document existence
      const doc = await ticketsService.findOne(data.id);
      if (doc)
        // Assume TicketEntity onDelete.CASCADE is enabled, all associated orders also deleted
        await ticketsService.removeOne(doc);

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };
}
