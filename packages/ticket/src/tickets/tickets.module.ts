import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/tickets/entity/ticket.entity';

import { TicketsService } from 'src/tickets/tickets.service';
import { TicketsResolver } from 'src/tickets/tickets.resolver';
import { TicketsStanEventsTransactionService } from 'src/tickets-stan-events-transaction/tickets-stan-events-transaction.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [
    TicketsResolver,
    TicketsService,
    StanEventsService,
    TicketsStanEventsTransactionService,
  ],
  exports: [TicketsService],
})
export class TicketsModule {}
