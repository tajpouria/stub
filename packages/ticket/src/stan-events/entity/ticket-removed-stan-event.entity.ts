import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { TicketRemovedEventData } from '@tajpouria/stub-common';

@Entity()
export class TicketRemovedStanEvent implements TicketRemovedEventData {
  // Identifiers
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
