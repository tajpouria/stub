import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/tickets/entity/ticket.entity';

import { TicketsService } from 'src/tickets/tickets.service';
import { TicketsResolver } from 'src/tickets/tickets.resolver';
import { TicketsListener } from 'src/tickets/tickets.listener';
import { StanEventsModule } from 'src/stan-events/stan-events.module';
import { DatabaseTransactionModule } from 'src/database-transaction/database-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    StanEventsModule,
    DatabaseTransactionModule,
  ],
  providers: [TicketsResolver, TicketsListener, TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
