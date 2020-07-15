import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { TicketCreatedEventData } from '@tajpouria/stub-common';

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
  public async isReserved() {
    // TODO:
  }
}
