import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StanEventsService } from 'src/stan-events/stan-events.service';
import { OrderCreatedStanEvent } from 'src/stan-events/entity/order-created-stan-event.entity';
import { OrderCancelledStanEvent } from 'src/stan-events/entity/order-cancelled-stan-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderCreatedStanEvent, OrderCancelledStanEvent]),
  ],
  providers: [StanEventsService],
  exports: [StanEventsService],
})
export class StanEventsModule {}
