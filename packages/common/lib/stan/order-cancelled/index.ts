import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

export interface OrderCancelledEventData {
  id: string;
}

export class OrderCancelledPublisher extends StanPublisher<
  OrderCancelledEventData
> {
  eventSchema = eventSchema;
}

export class OrderCancelledListener extends StanListener<
  OrderCancelledEventData
> {
  eventSchema = eventSchema;
}
