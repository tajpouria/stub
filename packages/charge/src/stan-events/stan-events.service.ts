import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderCreatedEventData,
  OrderCancelledEventData,
} from '@tajpouria/stub-common';

import { OrderCreatedStanEvent } from 'src/stan-events/entity/order-created-stan-event.entity';
import { OrderCancelledStanEvent } from 'src/stan-events/entity/order-cancelled-stan-event.entity';

@Injectable()
export class StanEventsService {
  constructor(
    @InjectRepository(OrderCreatedStanEvent)
    private readonly orderCreatedStanEventRepository: Repository<
      OrderCreatedStanEvent
    >,
    @InjectRepository(OrderCancelledStanEvent)
    private readonly orderCancelledStanEventRepository: Repository<
      OrderCancelledStanEvent
    >,
  ) {}

  createOneOrderCreated(eventData: OrderCreatedEventData) {
    return this.orderCreatedStanEventRepository.create({
      ...eventData,
      published: false,
    } as unknown);
  }

  createOneOrderCancelled(eventData: OrderCancelledEventData) {
    return this.orderCancelledStanEventRepository.create({
      ...eventData,
      published: false,
    } as unknown);
  }
}
