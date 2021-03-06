import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  VersionColumn,
  OneToMany,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { TicketCreatedEventData } from '@tajpouria/stub-common';

import { OrderEntity } from 'src/orders/entity/order.entity';

@ObjectType()
@Entity()
export class TicketEntity implements TicketCreatedEventData {
  // Identifiers
  /**
   * id should replicated from tickets service emitted ticket:created events and inserted manually; id should not generated by DBMS
   */
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  // Details
  @Field()
  @Column()
  title: string;

  @Field()
  @Column('float') // USD
  price: number;

  // Date
  @Field()
  @Column('bigint')
  timestamp: number;

  // Orders
  @Field(type => [OrderEntity])
  @OneToMany(
    type => OrderEntity,
    order => order.ticket,
    // Should delete all associated orders
    { onDelete: 'CASCADE' },
  )
  orders: OrderEntity[];

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
