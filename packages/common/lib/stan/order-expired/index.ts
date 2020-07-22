import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

export interface OrderExpiredEventData {
  id: string;
}

export class OrderExpiredPublisher extends StanPublisher<
  OrderExpiredEventData
> {
  eventSchema = eventSchema;
}

export class OrderExpiredListener extends StanListener<OrderExpiredEventData> {
  eventSchema = eventSchema;
}
