import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { v4 } from 'uuid';

import { OrderEntity } from 'src/orders/entity/order.entity';

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

  createOne(createInputDto: DeepPartial<OrderEntity>) {
    return this.orderRepository.create({
      ...createInputDto,
      id: v4(), // Manually injected id _Id not created on document template at this level but it's required in order to publish consistence id_
      version: 1,
    });
  }
}
