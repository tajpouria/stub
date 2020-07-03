import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ticket } from 'src/tickets/entity/ticket.entity';

import { TicketsService } from 'src/tickets/tickets.service';
import { TicketsResolver } from 'src/tickets/tickets.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Ticket])],
  providers: [TicketsService, TicketsResolver],
  exports: [TicketsService],
})
export class TicketsModule {}
