import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UpdateTicketInput {
  // Details
  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  pictureURL?: string;

  // Date
  @Field({ nullable: true })
  timestamp?: number;

  // Location
  @Field({ nullable: true })
  latitude?: number;

  @Field({ nullable: true })
  longitude?: number;

  @Field({ nullable: true })
  address?: string;
}

const { URL_PATTERN } = process.env;

export const updateTicketDto = Joi.object<UpdateTicketInput>({
  title: Joi.string()
    .min(3)
    .max(30),
  price: Joi.number().greater(0),
  quantity: Joi.number().greater(0),
  description: Joi.string()
    .min(3)
    .max(255),
  pictureURL: Joi.string().pattern(new RegExp(URL_PATTERN)),
  timestamp: Joi.number().greater(Date.now()),
  latitude: Joi.number(),
  longitude: Joi.number(),
  address: Joi.string()
    .min(3)
    .max(255),
});