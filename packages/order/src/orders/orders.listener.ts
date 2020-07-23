import { Injectable } from '@nestjs/common';
import {
  Logger,
  StanListenerOnMessageCallback,
  OrderExpiredEventData,
  OrderStatus,
} from '@tajpouria/stub-common';

import { orderExpiredListener } from 'src/orders/shared/order-expired-listener';
import { OrdersService } from 'src/orders/orders.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrderCancelledStanEvent } from 'src/stan-events/entity/order-cancelled-stan-event.entity';

const { NAME, NODE_ENV } = process.env;

@Injectable()
export class OrdersListener {
  private readonly logger = Logger(`${process.cwd()}/logs/orders-listener`);

  constructor(
    private readonly ordersService: OrdersService,
    private readonly stanEventsService: StanEventsService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {
    const { onOrderExpired } = this;
    // Initialize listeners
    if (NODE_ENV !== 'test') {
      orderExpiredListener.listen(NAME).onMessage(onOrderExpired);
    }
  }

  onOrderExpired: StanListenerOnMessageCallback<OrderExpiredEventData> = async (
    validationErrors,
    data,
    msg,
  ) => {
    const {
      logger,
      ordersService,
      stanEventsService,
      databaseTransactionService,
    } = this;

    try {
      if (validationErrors)
        throw new Error(JSON.stringify({ validationErrors, data }));

      // Verify document existence
      const doc = await ordersService.findOne({ id: data.id });
      if (!doc) throw new Error(`Order ${data.id} not found!`);

      // Not to cancel completed orders
      if (doc.status === OrderStatus.Complete) return msg.ack();

      // Update document
      doc.status = OrderStatus.Cancelled;

      // Create event
      const { id, version } = doc;
      const event = stanEventsService.createOneOrderCancelled({
        id,
        version: version + 1, // Document version will increment after update
      });

      // Save record and event in context of one database transaction
      await databaseTransactionService.process<
        [OrderEntity, OrderCancelledStanEvent]
      >([doc, 'save'], [event, 'save']);

      msg.ack();
    } catch (error) {
      if (NODE_ENV !== 'test') logger.error(error);
    }
  };
}
