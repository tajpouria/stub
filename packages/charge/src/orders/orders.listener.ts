import { Injectable } from '@nestjs/common';
import {
  Logger,
  StanListenerOnMessageCallback,
  OrderStatus,
  OrderCancelledEventData,
  OrderCreatedEventData,
  OrderCreatedListener,
  OrderCancelledListener,
} from '@tajpouria/stub-common';

import { OrdersService } from 'src/orders/orders.service';
import { stan } from 'src/shared/stan';

const { NAME, NODE_ENV } = process.env;

@Injectable()
export class OrdersListener {
  private readonly logger = Logger(`${process.cwd()}/logs/orders-listener`);

  constructor(private readonly ordersService: OrdersService) {
    const { onOrderCreated, onOrderCancelled } = this;
    // Initialize listeners
    if (NODE_ENV !== 'test') {
      new OrderCreatedListener(stan.instance)
        .listen(NAME)
        .onMessage(onOrderCreated);
      new OrderCancelledListener(stan.instance)
        .listen(NAME)
        .onMessage(onOrderCancelled);
    }
  }

  onOrderCreated: StanListenerOnMessageCallback<OrderCreatedEventData> = async (
    validationErrors,
    data,
    msg,
  ) => {
    const { logger, ordersService } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      // Create and save the document
      const { id, status, ticket, userId, version } = data;
      await ordersService.saveOne(
        ordersService.createOne({
          id,
          status,
          price: ticket.price,
          userId,
          version,
        }),
      );

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };

  onOrderCancelled: StanListenerOnMessageCallback<
    OrderCancelledEventData
  > = async (validationErrors, data, msg) => {
    const { logger, ordersService } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      // Verify document existence
      const doc = await ordersService.findOne({ id: data.id });
      if (!doc) throw new Error(`Order ${data.id} not found`);

      // Update document
      doc.status = OrderStatus.Cancelled;
      await ordersService.saveOne(doc);

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };
}
