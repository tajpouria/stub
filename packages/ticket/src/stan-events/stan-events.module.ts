import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StanEventsService } from 'src/stan-events/stan-events.service';
import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';
import { TicketUpdatedStanEvent } from 'src/stan-events/entity/ticket-updated-stan-event.entity';
import { TicketRemovedStanEvent } from 'src/stan-events/entity/ticket-removed-stan-event.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      TicketCreatedStanEvent,
      TicketUpdatedStanEvent,
      TicketRemovedStanEvent,
    ]),
  ],
  providers: [StanEventsService],
  exports: [StanEventsService],
})
export class StanEventsModule {}
