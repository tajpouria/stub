import { Module } from '@nestjs/common';
import { TicketsService } from 'src/tickets/tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { TicketsListener } from 'src/tickets/tickets.listener';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  providers: [TicketsService, TicketsListener],
  exports: [TicketsService],
})
export class TicketsModule {}
