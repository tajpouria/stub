import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';

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
    return this.orderRepository.find({ where });
  }

  findOne(
    where: FindOneOptions<OrderEntity>['where'],
  ): Promise<OrderEntity | null> {
    return this.orderRepository.findOne({ where });
  }

  // Since document is meant to be replicated from another service 'id' should provided manually
  createOne(createInputDto: DeepPartial<OrderEntity> & { id: string }) {
    return this.orderRepository.create(createInputDto);
  }

  saveOne(doc: OrderEntity) {
    return this.orderRepository.save(doc);
  }
}
