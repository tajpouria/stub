import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from 'src/orders/entity/order.entity';

import { OrdersService } from 'src/orders/orders.service';
import { OrdersResolver } from 'src/orders/orders.resolver';
import { StanEventsModule } from 'src/stan-events/stan-events.module';
import { DatabaseTransactionModule } from 'src/database-transaction/database-transaction.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    StanEventsModule,
    DatabaseTransactionModule,
  ],
  providers: [OrdersResolver, OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
