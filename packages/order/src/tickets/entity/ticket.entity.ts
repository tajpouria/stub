import { Entity, Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { TicketCreatedEventData } from '@tajpouria/stub-common';

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
  @Column('float')
  price: number;

  // Date
  @Field()
  @Column('bigint')
  timestamp: number;

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
