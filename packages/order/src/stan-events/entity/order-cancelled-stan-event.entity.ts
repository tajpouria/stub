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
  OrderCancelledPublisher,
} from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

const logger = Logger(process.cwd() + '/logs/stan/order-created-stan-event');

@Entity()
export class OrderCancelledStanEvent implements OrderCancelledEventData {
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
      const { id, version } = this;

      await new OrderCancelledPublisher(stan.instance).publish({ id, version });
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
        new OrderCancelledPublisher(stan.instance),
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
