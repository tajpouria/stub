import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

  findOne(id: string): Promise<Ticket | null> {
    return this.ticketRepository.findOne(id);
  }

  createOne(createTicketDto: CreateTicketInput & { userId: string }) {
    return this.ticketRepository.create({ ...createTicketDto, version: 1 });
  }
}
