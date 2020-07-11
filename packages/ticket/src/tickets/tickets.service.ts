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
    return this.ticketRepository.create(createTicketDto);
  }

  updateOne(id: string, updateTicketDto: Partial<CreateTicketInput>) {
    return this.ticketRepository.update(id, { ...updateTicketDto });
  }

  async removeOne(id: string): Promise<void> {
    await this.ticketRepository.delete(id);
  }
}
