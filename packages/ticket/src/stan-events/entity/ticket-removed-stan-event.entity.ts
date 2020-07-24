import {
  Entity,
  PrimaryGeneratedColumn,
  AfterInsert,
  getConnection,
  Column,
  AfterLoad,
} from 'typeorm';
import {
  TicketRemovedEventData,
  Logger,
  publishUnpublishedStanEvents,
} from '@tajpouria/stub-common';
import { ticketRemovedPublisher } from 'src/tickets/shared/ticket-removed-publisher';

const logger = Logger(process.cwd() + '/logs/stan/ticket-removed-stan-event');

@Entity()
export class TicketRemovedStanEvent implements TicketRemovedEventData {
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

      await ticketRemovedPublisher.publish({ id, version });
      this.published = true;
    } catch (error) {
      logger.error(new Error(error));
    }
  }

  @AfterLoad()
  async publishUnpublishedStanEvents() {
    try {
      await publishUnpublishedStanEvents(
        getConnection().getRepository(TicketRemovedStanEvent),
        ticketRemovedPublisher,
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
