import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class StanEvent {
  // Identifiers
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ nullable: true })
  userId: string;

  // Details
  @Column({ nullable: true })
  title: string;

  @Column('float', { nullable: true })
  price: number;

  // Date
  @Column('bigint', { nullable: true })
  timestamp: number;
}
