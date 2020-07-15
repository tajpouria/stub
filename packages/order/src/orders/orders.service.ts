import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions, FindManyOptions } from 'typeorm';

import { OrderEntity } from 'src/orders/entity/order.entity';
import { CreateOrderInput } from 'src/orders/dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private orderRepository: Repository<OrderEntity>,
  ) {}

  findAll(
    where: FindManyOptions<OrderEntity>['where'],
  ): Promise<OrderEntity[]> {
    return this.orderRepository.find({ where, relations: ['ticket'] });
  }

  findOne(
    where: FindOneOptions<OrderEntity>['where'],
  ): Promise<OrderEntity | null> {
    return this.orderRepository.findOne({ where, relations: ['ticket'] });
  }

  createOne(createTicketDto: CreateOrderInput) {
    // TODO: & { userId: string }
    return this.orderRepository.create(createTicketDto);
  }
}
