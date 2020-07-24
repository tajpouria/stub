import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StanEventsService } from 'src/stan-events/stan-events.service';
import { OrderCompletedStanEvent } from 'src/stan-events/entity/order-completed-stan-event.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OrderCompletedStanEvent])],
  providers: [StanEventsService],
  exports: [StanEventsService],
})
export class StanEventsModule {}
