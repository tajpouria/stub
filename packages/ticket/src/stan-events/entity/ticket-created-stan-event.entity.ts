import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  AfterInsert,
  getConnection,
} from 'typeorm';
import {
  TicketCreatedEventData,
  Logger,
  publishAndRemoveStanEventRecord,
} from '@tajpouria/stub-common';

import { ticketCreatedPublisher } from 'src/tickets/shared/ticket-created-publisher';

const logger = Logger(process.cwd() + '/logs/stan-events');

@Entity()
export class TicketCreatedStanEvent implements TicketCreatedEventData {
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
      await publishAndRemoveStanEventRecord(
        getConnection().getRepository(TicketCreatedStanEvent),
        ticketCreatedPublisher,
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
