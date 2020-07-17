import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

export interface TicketCreatedEventData {
  version: number;
  id: string;
  title: string;
  price: number;
  userId: string;
  timestamp: number;
}

export class TicketCreatedPublisher extends StanPublisher<
  TicketCreatedEventData
> {
  eventSchema = eventSchema;
}

export class TicketCreatedListener extends StanListener<
  TicketCreatedEventData
> {
  eventSchema = eventSchema;
}
