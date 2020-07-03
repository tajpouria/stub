import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { CreateTicketDto } from 'src/tickets/dto/createTicket.dto';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket)
    private ticketRepository: Repository<Ticket>,
  ) {}

  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }

  findOne(id: string): Promise<Ticket> {
    return this.ticketRepository.findOne(id);
  }

  createOne(createTicketDto: CreateTicketDto & { userId: string }) {
    return this.ticketRepository.create(createTicketDto);
  }

  async remove(id: string): Promise<void> {
    this.ticketRepository.delete(id);
  }
}
