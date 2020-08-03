import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChargesService } from 'src/charges/charges.service';
import { StanEventsModule } from 'src/stan-events/stan-events.module';
import { DatabaseTransactionModule } from 'src/database-transaction/database-transaction.module';
import { ChargesResolver } from 'src/charges/charges.resolver';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
import { AuthModule } from 'src/auth/auth.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChargeEntity]),
    AuthModule,
    OrdersModule,
    StanEventsModule,
    DatabaseTransactionModule,
  ],
  providers: [ChargesResolver, ChargesService],
})
export class ChargesModule {}
