import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  AfterLoad,
  getConnection,
} from 'typeorm';
import {
  TicketUpdatedEventData,
  Logger,
  publishUnpublishedStanEvents,
  TicketUpdatedPublisher,
} from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

const logger = Logger(process.cwd() + '/logs/stan/ticket-updated-stan-event');
@Entity()
export class TicketUpdatedStanEvent implements TicketUpdatedEventData {
  // Version
  // Should provide manually
  @Column('int')
  version: number;

  @Column('boolean')
  published: boolean;

  // Identifiers
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  // Details
  @Column()
  title: string;

  @Column('float')
  price: number;

  // Date
  @Column('bigint')
  timestamp: number;

  @AfterInsert()
  async publishStanEvent() {
    try {
      const { id, title, version, price, timestamp, userId } = this;

      await new TicketUpdatedPublisher(stan.instance).publish({
        id,
        title,
        version,
        price,
        timestamp,
        userId,
      });
      this.published = true;
    } catch (error) {
      logger.error(new Error(error));
    }
  }

  @AfterLoad()
  async publishUnpublishedStanEvents() {
    try {
      await publishUnpublishedStanEvents(
        getConnection().getRepository(TicketUpdatedStanEvent),
        new TicketUpdatedPublisher(stan.instance),
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
