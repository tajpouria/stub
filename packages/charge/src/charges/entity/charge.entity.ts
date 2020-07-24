import { Field, ObjectType } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  VersionColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { OrderEntity } from 'src/orders/entity/order.entity';

@ObjectType()
@Entity()
export class ChargeEntity {
  // Identifiers
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  userId: string;

  // Order
  @OneToOne(type => OrderEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  order: OrderEntity;

  // Version
  // Hidden Field
  @VersionColumn()
  version: number;
}
