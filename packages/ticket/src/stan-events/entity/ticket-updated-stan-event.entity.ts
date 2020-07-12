import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TicketUpdatedEventData } from '@tajpouria/stub-common';

@Entity()
export class TicketUpdatedStanEvent implements TicketUpdatedEventData {
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
}
