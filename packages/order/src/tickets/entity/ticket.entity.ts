import { Entity, Column, PrimaryGeneratedColumn, getConnection } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { TicketCreatedEventData, OrderStatus } from '@tajpouria/stub-common';
import { OrderEntity } from 'src/orders/entity/order.entity';

@ObjectType()
@Entity()
export class TicketEntity implements TicketCreatedEventData {
  // Identifiers
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
  @Column('float')
  price: number;

  // Date
  @Field()
  @Column('bigint')
  timestamp: number;

  /**
   * True if ticket is currently under order reservation
   */
  async isReserved(): Promise<boolean> {
    return !!(await getConnection()
      .getRepository(OrderEntity)
      .findOne({
        where: [
          { ticket: this, status: OrderStatus.Created },
          { ticket: this, status: OrderStatus.AwaitingPayment },
          { ticket: this, status: OrderStatus.Complete },
        ],
      }));
  }
}
