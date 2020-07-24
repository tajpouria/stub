import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from 'src/orders/entity/order.entity';

import { OrdersService } from 'src/orders/orders.service';
import { OrdersListener } from 'src/orders/orders.listener';

@Module({
  imports: [TypeOrmModule.forFeature([OrderEntity])],
  providers: [OrdersService, OrdersListener],
  exports: [OrdersService],
})
export class OrdersModule {}
