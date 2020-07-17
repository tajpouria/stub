import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  getConnection,
  AfterInsert,
  AfterLoad,
} from 'typeorm';
import {
  Logger,
  publishUnpublishedStanEvents,
  OrderCancelledEventData,
} from '@tajpouria/stub-common';

import { orderCancelledPublisher } from 'src/orders/shared/order-cancelled-publisher';

const logger = Logger(process.cwd() + '/logs/stan/order-created-stan-event');

@Entity()
export class OrderCancelledStanEvent implements OrderCancelledEventData {
  // Version
  // Should provide manually
  @Column('int')
  version;

  @Column('boolean')
  published: boolean;

  // Identifiers
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AfterInsert()
  async publishStanEvent() {
    try {
      await orderCancelledPublisher.publish(this);
      this.published = true;
    } catch (error) {
      logger.error(new Error(error));
    }
  }

  @AfterLoad()
  async publishUnpublishedStanEvents() {
    try {
      await publishUnpublishedStanEvents(
        getConnection().getRepository(OrderCancelledStanEvent),
        orderCancelledPublisher,
      );
    } catch (error) {
      logger.info(new Error(error));
    }
  }
}
