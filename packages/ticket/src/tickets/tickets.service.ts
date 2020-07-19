import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { CreateTicketInput } from 'src/tickets/dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  findOne(where: FindOneOptions<Ticket>['where']): Promise<Ticket | undefined> {
    return this.ticketRepository.findOne({ where });
  }

  createOne(createTicketDto: CreateTicketInput & { userId: string }) {
    return this.ticketRepository.create({ ...createTicketDto, version: 1 });
  }
}
