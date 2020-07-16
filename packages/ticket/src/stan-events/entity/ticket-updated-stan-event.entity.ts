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
} from '@tajpouria/stub-common';

import { ticketUpdatedPublisher } from 'src/tickets/shared/ticket-updated-publisher';

const logger = Logger(process.cwd() + '/logs/stan/ticket-updated-stan-event');
@Entity()
export class TicketUpdatedStanEvent implements TicketUpdatedEventData {
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
      await ticketUpdatedPublisher.publish(this);
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
        ticketUpdatedPublisher,
      );
    } catch (error) {
      logger.info(new Error(error));
    }
  }
}
