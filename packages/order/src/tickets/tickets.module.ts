import { Module } from '@nestjs/common';
import { TicketsService } from 'src/tickets/tickets.service';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TicketEntity } from 'src/tickets/entity/ticket.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TicketEntity])],
  providers: [TicketsService],
  exports: [TicketsService],
})
export class TicketsModule {}
