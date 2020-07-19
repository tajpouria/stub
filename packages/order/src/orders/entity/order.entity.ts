import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  VersionColumn,
  ManyToOne,
} from 'typeorm';
import { OrderStatus } from '@tajpouria/stub-common';

import { TicketEntity } from 'src/tickets/entity/ticket.entity';

const { NODE_ENV } = process.env;

@ObjectType()
@Entity()
export class OrderEntity {
  // Identifiers
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  // Details
  @Field()
  @Column({ default: OrderStatus.Created })
  status: OrderStatus;

  // Date
  /**
   * ExpiresAt property should collect in format ISO 8601
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
  @Field()
  @Column()
  expiresAt: string;

  // Ticket
  @Field(type => TicketEntity)
  @ManyToOne(
    type => TicketEntity,
    ticket => ticket.orders,
    // For test cleanup purposes
    { onDelete: NODE_ENV === 'test' ? 'CASCADE' : 'DEFAULT' },
  )
  ticket: TicketEntity;

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
