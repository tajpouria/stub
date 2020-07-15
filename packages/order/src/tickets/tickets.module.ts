import { Module } from '@nestjs/common';
import { TicketsService } from 'src/tickets/tickets.service';

@Module({
  providers: [TicketsService]
})
export class TicketsModule {}
