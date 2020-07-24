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
  OrderCompletedEventData,
} from '@tajpouria/stub-common';

import { orderCompletedPublisher } from 'src/orders/shared/order-completed-publisher';

const logger = Logger(process.cwd() + '/logs/stan/order-completed-stan-event');

@Entity()
export class OrderCompletedStanEvent implements OrderCompletedEventData {
  // Version
  // Should provide manually
  @Column('int')
  version: number;

  @Column('boolean')
  published: boolean;

  // Identifiers
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @AfterInsert()
  async publishStanEvent() {
    try {
      const { id } = this;

      await orderCompletedPublisher.publish({ id });
      this.published = true;
    } catch (error) {
      logger.error(new Error(error));
    }
  }

  @AfterLoad()
  async publishUnpublishedStanEvents() {
    try {
      await publishUnpublishedStanEvents(
        getConnection().getRepository(OrderCompletedStanEvent),
        orderCompletedPublisher,
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
