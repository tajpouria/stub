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
  quantity: number;

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
    .max(255),
  pictureURL: Joi.string().pattern(
    /((http|https):\/\/?)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/,
  ),
  timestamp: Joi.number()
    .greater(Date.now())
    .required(),
  latitude: Joi.number().required(),
  longitude: Joi.number().required(),
  address: Joi.string()
    .min(3)
    .max(255),
});
