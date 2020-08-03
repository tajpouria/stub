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
  OrderCompletedPublisher,
} from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

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
      const { id, version } = this;

      await new OrderCompletedPublisher(stan.instance).publish({ id, version });
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
        new OrderCompletedPublisher(stan.instance),
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
