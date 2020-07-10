import { StanListener } from '../stan-listener';
import { StanPublisher } from '../stan-publisher';

import * as eventSchema from './event-schema.json';

interface EventData {
  id: string;
}

export class TicketRemovedPublisher extends StanPublisher<EventData> {
  eventSchema = eventSchema;
}

export class TicketRemovedListener extends StanListener<EventData> {
  eventSchema = eventSchema;
}
