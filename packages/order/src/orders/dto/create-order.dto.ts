import Joi from '@hapi/joi';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {}

export const createOrderDto = Joi.object<CreateOrderInput>({});
