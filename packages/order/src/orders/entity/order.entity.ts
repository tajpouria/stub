import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity()
export class Order {
  // Identifiers
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
