import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TicketCreatedEventData } from '@tajpouria/stub-common';

import { StanEvent } from 'src/stan-events/entity/stan-event.entity';

@Injectable()
export class StanEventsService {
  constructor(
    @InjectRepository(StanEvent)
    private stanEventRepository: Repository<StanEvent>,
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
