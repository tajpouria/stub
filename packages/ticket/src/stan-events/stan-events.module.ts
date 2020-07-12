import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';
import { StanEventsService } from 'src/stan-events/stan-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([TicketCreatedStanEvent])],
  providers: [StanEventsService],
  exports: [StanEventsService],
})
export class StanEventsModule {}
