import { Module } from '@nestjs/common';

import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';

@Module({
  providers: [DatabaseTransactionService],
  exports: [DatabaseTransactionService],
})
export class DatabaseTransactionModule {}
