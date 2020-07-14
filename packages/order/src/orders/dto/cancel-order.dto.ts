import Joi from '@hapi/joi';
import { InputType } from '@nestjs/graphql';

@InputType()
export class CancelOrderInput {}

export const cancelOrderDto = Joi.object<CancelOrderInput>({});
