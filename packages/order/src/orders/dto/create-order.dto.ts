import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  ticketId: string;
}

export const createOrderDto = Joi.object<CreateOrderInput>({
  ticketId: Joi.string()
    .guid()
    .required(),
});
