import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateTicketInput {
  // Details
  @Field()
  title: string;

  @Field()
  price: number;

  @Field({ nullable: true })
  quantity?: number;

  @Field()
  description: string;

  @Field({ nullable: true })
  pictureURL?: string;

  // Date
  @Field()
  timestamp: number;

  // Location
  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field({ nullable: true })
  address?: string;
}

const { URL_PATTERN } = process.env;

export const createTicketDto = Joi.object<CreateTicketInput>({
  title: Joi.string()
    .min(3)
    .max(30)
    .required(),
  price: Joi.number()
    .greater(0)
    .required(),
  quantity: Joi.number().greater(0),
  description: Joi.string()
    .min(3)
    .max(1000)
    .required(),
  pictureURL: Joi.string().pattern(new RegExp(URL_PATTERN)),
  timestamp: Joi.number()
    .greater(Date.now())
    .required(),
  lat: Joi.number().required(),
  lng: Joi.number().required(),
  address: Joi.string()
    .min(3)
    .max(255),
});
