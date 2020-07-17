import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

export interface TicketUpdatedEventData {
  version: number;
  id: string;
  title: string;
  price: number;
  userId: string;
  timestamp: number;
}

export class TicketUpdatedPublisher extends StanPublisher<
  TicketUpdatedEventData
> {
  eventSchema = eventSchema;
}

export class TicketUpdatedListener extends StanListener<
  TicketUpdatedEventData
> {
  eventSchema = eventSchema;
}
