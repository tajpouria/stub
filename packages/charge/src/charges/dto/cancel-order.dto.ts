import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CancelOrderInput {
  @Field()
  id: string;
}

export const cancelOrderDto = Joi.object<CancelOrderInput>({
  id: Joi.string()
    .guid()
    .required(),
});
