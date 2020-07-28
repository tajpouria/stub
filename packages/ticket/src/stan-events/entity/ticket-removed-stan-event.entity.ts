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
  TicketRemovedPublisher,
} from '@tajpouria/stub-common';

import { stan } from 'src/shared/stan';

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

      await new TicketRemovedPublisher(stan.instance).publish({ id, version });
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
        new TicketRemovedPublisher(stan.instance),
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
