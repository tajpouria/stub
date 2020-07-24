import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  OrderCreatedEventData,
  OrderCompletedEventData,
} from '@tajpouria/stub-common';

import { OrderCompletedStanEvent } from 'src/stan-events/entity/order-completed-stan-event.entity';

@Injectable()
export class StanEventsService {
  constructor(
    @InjectRepository(OrderCompletedStanEvent)
    private readonly orderCompletedStanEventRepository: Repository<
      OrderCompletedStanEvent
    >,
  ) {}

  createOneOrderCompleted(eventData: OrderCompletedEventData) {
    return this.orderCompletedStanEventRepository.create({
      ...eventData,
      published: false,
    } as unknown);
  }
}
