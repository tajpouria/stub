import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { OrderStatus } from '@tajpouria/stub-common';

import { TicketEntity } from 'src/tickets/entity/ticket.entity';

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
  @Field()
  @Column()
  expiresAt: string;

  // Ticket
  @Field()
  @OneToOne(type => TicketEntity, { cascade: true })
  @JoinColumn()
  ticket: TicketEntity;
}
