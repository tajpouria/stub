import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateStripeChargeInput {
  @Field()
  orderId: string;

  @Field()
  source: string;
}

export const createStripeChargeDto = Joi.object<CreateStripeChargeInput>({
  orderId: Joi.string()
    .guid()
    .required(),
  source: Joi.string()
    .min(3)
    .required(),
});
