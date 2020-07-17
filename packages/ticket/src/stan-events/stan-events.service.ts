import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import {
  TicketCreatedEventData,
  TicketUpdatedEventData,
  TicketRemovedEventData,
} from '@tajpouria/stub-common';

import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';
import { TicketUpdatedStanEvent } from 'src/stan-events/entity/ticket-updated-stan-event.entity';
import { TicketRemovedStanEvent } from 'src/stan-events/entity/ticket-removed-stan-event.entity';

@Injectable()
export class StanEventsService {
  constructor(
    @InjectRepository(TicketCreatedStanEvent)
    private readonly ticketCreatedStanEventRepository: Repository<
      TicketCreatedStanEvent
    >,
    @InjectRepository(TicketUpdatedStanEvent)
    private readonly ticketUpdatedStanEventRepository: Repository<
      TicketUpdatedStanEvent
    >,
    @InjectRepository(TicketRemovedStanEvent)
    private readonly ticketRemovedStanEventRepository: Repository<
      TicketRemovedStanEvent
    >,
  ) {}

  createOneTicketCreated(eventData: TicketCreatedEventData) {
    return this.ticketCreatedStanEventRepository.create(({
      ...eventData,
      published: false,
    } as unknown) as DeepPartial<TicketCreatedStanEvent>);
  }

  createOneTicketUpdated(ticketEventData: TicketUpdatedEventData) {
    return this.ticketUpdatedStanEventRepository.create(({
      ...ticketEventData,
      published: false,
    } as unknown) as DeepPartial<TicketUpdatedStanEvent>);
  }

  createOneTicketRemoved(ticketEventData: TicketRemovedEventData) {
    return this.ticketRemovedStanEventRepository.create(({
      ...ticketEventData,
      published: false,
    } as unknown) as DeepPartial<TicketRemovedStanEvent>);
  }
}
