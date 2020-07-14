import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from 'src/orders/entity/order.entity';
import { CreateOrderInput } from 'src/orders/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  findOne(id: string): Promise<Order | null> {
    return this.orderRepository.findOne(id);
  }

  createOne(createTicketDto: CreateOrderInput) {
    // TODO: & { userId: string }
    return this.orderRepository.create(createTicketDto);
  }
}
