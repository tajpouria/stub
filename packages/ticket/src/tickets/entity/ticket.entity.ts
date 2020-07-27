import { Entity, Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Field, ObjectType, Int } from '@nestjs/graphql';
import { ticketsConstants } from 'src/tickets/constants';

@ObjectType()
@Entity()
export class Ticket {
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
  @Column('float') // USD
  price: number;

  @Field()
  @Column('blob')
  description: string;

  @Field()
  @Column({ default: ticketsConstants.defaultPictureURL })
  pictureURL: string;

  // Date
  @Field()
  @Column('bigint', { default: Date.now })
  timestamp: number;

  // Location
  @Field()
  @Column('float')
  latitude: number;

  @Field()
  @Column('float')
  longitude: number;

  @Field()
  @Column({ nullable: true })
  address: string;

  // Order
  @Field()
  @Column({ nullable: true, default: null })
  lastOrderId: string; // If lastOrderId == null means document is not locked otherwise consider as lock document

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
