import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  getConnection,
  AfterInsert,
  AfterLoad,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import {
  OrderCreatedEventData,
  Logger,
  publishUnpublishedStanEvents,
  OrderStatus,
} from '@tajpouria/stub-common';

import { orderCreatedPublisher } from 'src/orders/shared/order-created-publisher';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';

const logger = Logger(process.cwd() + '/logs/stan/order-created-stan-event');

const { NODE_ENV } = process.env;

@Entity()
export class OrderCreatedStanEvent implements OrderCreatedEventData {
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
  status: OrderStatus;

  // Date
  @Column()
  expiresAt: string;

  // Ticket
  @OneToOne(type => TicketEntity, {
    // For test clean up purposes
    onDelete: NODE_ENV === 'test' ? 'CASCADE' : 'DEFAULT',
  })
  @JoinColumn()
  ticket: TicketEntity;

  @AfterInsert()
  async publishStanEvent() {
    const { id, version, userId, ticket, status, expiresAt } = this;

    try {
      await orderCreatedPublisher.publish({
        id,
        version,
        userId,
        ticket: {
          id: ticket.id,
          price: ticket.price,
          timestamp: ticket.timestamp,
          title: ticket.title,
          userId: ticket.userId,
        },
        status,
        expiresAt,
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
        getConnection().getRepository(OrderCreatedStanEvent),
        orderCreatedPublisher,
      );
    } catch (error) {
      logger.error(new Error(error));
    }
  }
}
