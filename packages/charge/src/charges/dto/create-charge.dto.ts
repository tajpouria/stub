import Joi from '@hapi/joi';
import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateChargeInput {
  @Field()
  orderId: string;
}

export const createChargeDto = Joi.object<CreateChargeInput>({
  orderId: Joi.string()
    .guid()
    .required(),
});
