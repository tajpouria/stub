import { StanListener } from "../stan-listener";
import { StanPublisher } from "../stan-publisher";

import * as eventSchema from "./event-schema.json";

interface EventData {
  id: string;
  title: string;
  price: number;
  userId: string;
  timestamp: number;
}

export class TicketCreatedPublisher extends StanPublisher<EventData> {
  eventSchema = eventSchema;
}

export class TicketCreatedListener extends StanListener<EventData> {
  eventSchema = eventSchema;
}
