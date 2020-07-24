import { Injectable } from '@nestjs/common';
import {
  Logger,
  StanListenerOnMessageCallback,
  OrderExpiredEventData,
  OrderStatus,
  OrderCancelledEventData,
  OrderCreatedEventData,
} from '@tajpouria/stub-common';

import { OrdersService } from 'src/orders/orders.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';
import { orderCreatedListener } from 'src/orders/shared/order-created-listener';
import { orderCancelledListener } from 'src/orders/shared/order-cancelled-listener';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrderCancelledStanEvent } from 'src/stan-events/entity/order-cancelled-stan-event.entity';

const { NAME, NODE_ENV } = process.env;

@Injectable()
export class OrdersListener {
  private readonly logger = Logger(`${process.cwd()}/logs/orders-listener`);

  constructor(private readonly ordersService: OrdersService) {
    const { onOrderCreated, onOrderCancelled } = this;
    // Initialize listeners
    if (NODE_ENV !== 'test') {
      orderCreatedListener.listen(NAME).onMessage(onOrderCreated);
      orderCancelledListener.listen(NAME).onMessage(onOrderCancelled);
    }
  }

  onOrderCreated: StanListenerOnMessageCallback<OrderCreatedEventData> = async (
    validationErrors,
    data,
    msg,
  ) => {
    const { logger } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };

  onOrderCancelled: StanListenerOnMessageCallback<
    OrderCancelledEventData
  > = async (validationErrors, data, msg) => {
    const { logger } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };
}
