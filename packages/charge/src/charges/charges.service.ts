import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindOneOptions,
  FindManyOptions,
  DeepPartial,
} from 'typeorm';
import { v4 } from 'uuid';

import { ChargeEntity } from 'src/charges/entity/charge.entity';

@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(ChargeEntity)
    private repository: Repository<ChargeEntity>,
  ) {}

  findAll(
    where: FindManyOptions<ChargeEntity>['where'],
  ): Promise<ChargeEntity[]> {
    return this.repository.find({ where, relations: ['order'] });
  }

  findOne(
    where: FindOneOptions<ChargeEntity>['where'],
  ): Promise<ChargeEntity | null> {
    return this.repository.findOne({ where, relations: ['order'] });
  }

  createOne(createInputDto: DeepPartial<ChargeEntity>) {
    return this.repository.create({
      ...createInputDto,
      id: v4(), // Manually injected id _Id not created on document template at this level but it's required in order to publish consistence id_
    });
  }
}
