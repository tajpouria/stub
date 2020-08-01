import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTicketInput {
  // Details
  @Field()
  title: string;

  @Field()
  price: number;

  @Field()
  description: string;

  @Field({ nullable: true })
  imageUrl?: string;

  // Date
  @Field({ nullable: true })
  timestamp?: number;

  // Location
  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field({ nullable: true })
  address?: string;
}

export const createTicketDto = Joi.object<CreateTicketInput>({
  title: Joi.string()
    .min(3)
    .max(22)
    .required(),
  price: Joi.number()
    .greater(0)
    .required(),
  description: Joi.string()
    .min(3)
    .max(10000)
    .required(),
  imageUrl: Joi.string(),
  timestamp: Joi.number().greater(Date.now()),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  address: Joi.string()
    .min(3)
    .max(1000),
});
