import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  getConnection,
  AfterInsert,
  AfterLoad,
} from 'typeorm';
import {
  TicketCreatedEventData,
  Logger,
  publishUnpublishedStanEvents,
} from '@tajpouria/stub-common';

import { ticketCreatedPublisher } from 'src/tickets/shared/ticket-created-publisher';

const logger = Logger(process.cwd() + '/logs/stan/ticket-created-stan-event');

@Entity()
export class TicketCreatedStanEvent implements TicketCreatedEventData {
  @Column('boolean', { default: false })
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
      await ticketCreatedPublisher.publish(this);
      this.published = true;
    } catch (error) {
      logger.error(new Error(error));
    }
  }

  @AfterLoad()
  async publishUnpublishedStanEvents() {
    try {
      await publishUnpublishedStanEvents(
        getConnection().getRepository(TicketCreatedStanEvent),
        ticketCreatedPublisher,
      );
    } catch (error) {
      logger.info(new Error(error));
    }
  }
}
