import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial } from 'typeorm';
import { OrderCreatedEventData } from '@tajpouria/stub-common';

import { OrderCreatedStanEvent } from 'src/stan-events/entity/order-created-stan-event.entity';

@Injectable()
export class StanEventsService {
  constructor(
    @InjectRepository(OrderCreatedStanEvent)
    private readonly orderCreatedStanEventRepository: Repository<
      OrderCreatedStanEvent
    >,
  ) {}

  createOneOrderCreated(eventData: DeepPartial<OrderCreatedEventData>) {
    return this.orderCreatedStanEventRepository.create({
      ...eventData,
      published: false,
    });
  }
}
