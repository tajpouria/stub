import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
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
  @Column('int')
  quantity: number;

  @Field()
  @Column({ nullable: true, default: '' })
  description: string;

  @Field()
  @Column({ nullable: true, default: ticketsConstants.defaultPictureURL })
  pictureURL: string;

  // Date
  @Field()
  @Column('timestamp')
  timestamp: number;

  // Location
  @Field()
  @Column('float')
  latitude: number;

  @Field()
  @Column('float')
  longitude: number;

  @Field()
  @Column({ nullable: true, default: '' })
  address: string;
}
