import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOneOptions } from 'typeorm';
import { v4 } from 'uuid';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { CreateTicketInput } from 'src/tickets/dto/create-ticket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  findAll(take: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      take,
      order: {
        timestamp: 'DESC',
      },
    });
  }

  findOne(where: FindOneOptions<Ticket>['where']): Promise<Ticket | undefined> {
    return this.ticketRepository.findOne({ where });
  }

  createOne(createTicketDto: CreateTicketInput & { userId: string }) {
    return this.ticketRepository.create({
      timestamp: Date.now(),
      ...createTicketDto,
      id: v4(), // Manually injected id _Id not created on document template at this level but it's required in order to publish consistence id_
      version: 1,
    });
  }
}
