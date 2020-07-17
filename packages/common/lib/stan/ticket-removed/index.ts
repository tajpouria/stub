import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

export interface TicketRemovedEventData {
  version: number;
  id: string;
}

export class TicketRemovedPublisher extends StanPublisher<
  TicketRemovedEventData
> {
  eventSchema = eventSchema;
}

export class TicketRemovedListener extends StanListener<
  TicketRemovedEventData
> {
  eventSchema = eventSchema;
}
