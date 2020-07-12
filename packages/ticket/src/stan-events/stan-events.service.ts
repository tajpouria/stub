import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketCreatedEventData } from '@tajpouria/stub-common';

import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';

@Injectable()
export class StanEventsService {
  constructor(
    @InjectRepository(TicketCreatedStanEvent)
    private stanEventRepository: Repository<TicketCreatedStanEvent>,
  ) {}

  createOne(
    ticketEventData: Partial<TicketCreatedEventData> & { id: string },
  ) {
    return this.stanEventRepository.create(ticketEventData);
  }

  async removeOne(id: string): Promise<void> {
    await this.stanEventRepository.delete(id);
  }
}
