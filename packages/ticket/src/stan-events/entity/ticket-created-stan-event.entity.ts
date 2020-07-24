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
      const { id, version, userId, timestamp, title, price } = this;

      await ticketCreatedPublisher.publish({
        id,
        version,
        userId,
        timestamp,
        price,
        title,
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
        getConnection().getRepository(TicketCreatedStanEvent),
        ticketCreatedPublisher,
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
