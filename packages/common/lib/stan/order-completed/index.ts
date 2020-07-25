import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

export interface OrderCompletedEventData {
  version: number;
  id: string;
}

export class OrderCompletedPublisher extends StanPublisher<
  OrderCompletedEventData
> {
  eventSchema = eventSchema;
}

export class OrderCompletedListener extends StanListener<
  OrderCompletedEventData
> {
  eventSchema = eventSchema;
}
