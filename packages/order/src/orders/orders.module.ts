import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/entity/order.entity';

import { OrdersService } from 'src/orders/orders.service';
import { OrdersResolver } from 'src/orders/orders.resolver';
import { StanEventsModule } from 'src/stan-events/stan-events.module';
import { DatabaseTransactionModule } from 'src/database-transaction/database-transaction.module';
import { OrdersListener } from 'src/orders/orders.listener';
import { AuthModule } from 'src/auth/auth.module';
import { TicketsModule } from 'src/tickets/tickets.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderEntity]),
    StanEventsModule,
    DatabaseTransactionModule,
    AuthModule,
    OrdersModule,
    TicketsModule,
  ],
  providers: [OrdersResolver, OrdersService, OrdersListener],
  exports: [OrdersService],
})
export class OrdersModule {}
