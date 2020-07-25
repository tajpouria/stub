import { Field, ObjectType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, VersionColumn } from 'typeorm';

import { OrderStatus } from '@tajpouria/stub-common';

@ObjectType()
@Entity()
export class OrderEntity {
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
  status: OrderStatus;

  @Field()
  @Column('float')
  price: number;

  // (OneToOne) => Charge
  // ChargeId: string

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
