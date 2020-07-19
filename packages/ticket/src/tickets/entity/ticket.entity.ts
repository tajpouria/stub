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
  @Column('float')
  price: number;

  @Field(type => Int)
  @Column('int', { default: 1 })
  quantity: number;

  @Field()
  @Column({ nullable: true })
  description: string;

  @Field()
  @Column({ default: ticketsConstants.defaultPictureURL })
  pictureURL: string;

  // Date
  @Field()
  @Column('bigint')
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
  lastOrderId: string;

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
