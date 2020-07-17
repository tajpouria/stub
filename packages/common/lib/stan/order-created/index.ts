import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';
import { OrderStatus } from '../types';

export interface OrderCreatedEventData {
  version: number;
  id: string;
  status: OrderStatus;
  expiresAt: string;
  userId: string;
  ticket: {
    id: string;
    title: string;
    price: number;
    userId: string;
    timestamp: number;
  };
}

export class OrderCreatedPublisher extends StanPublisher<
  OrderCreatedEventData
> {
  eventSchema = eventSchema;
}

export class OrderCreatedListener extends StanListener<OrderCreatedEventData> {
  eventSchema = eventSchema;
}
