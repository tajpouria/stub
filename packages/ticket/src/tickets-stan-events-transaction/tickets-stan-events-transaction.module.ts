import { Module } from '@nestjs/common';

import { TicketsStanEventsTransactionService } from 'src/tickets-stan-events-transaction/tickets-stan-events-transaction.service';

@Module({
  imports: [TicketsStanEventsTransactionService],
  exports: [TicketsStanEventsTransactionService],
})
export class TicketsStanEventsTransactionModule {}
