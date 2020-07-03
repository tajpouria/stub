import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTicketDto {
  // Details
  @Field()
  title: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  description: string;

  @Field({ nullable: true })
  pictureURL: string;

  // Date
  @Field()
  timestamp: number;

  // Location
  @Field()
  latitude: number;

  @Field()
  longitude: number;

  @Field({ nullable: true })
  address: string;
}
