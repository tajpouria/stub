import { Entity, Column, PrimaryGeneratedColumn, VersionColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

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
  @Column('longtext')
  description: string;

  @Field({ nullable: true })
  @Column('longtext', { nullable: true })
  imageUrl?: string;

  // Date
  @Field()
  @Column('bigint')
  timestamp: number;

  // Location
  @Field()
  @Column('float')
  lat: number;

  @Field()
  @Column('float')
  lng: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  // Order
  @Field({ nullable: true })
  @Column({ nullable: true, default: null })
  lastOrderId?: string; // If lastOrderId == null means document is not locked otherwise consider as lock document

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
