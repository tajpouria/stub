import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TicketEntity } from 'src/tickets/entity/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
  ) {}

  findOne(id: string): Promise<TicketEntity | null> {
    return this.ticketRepository.findOne(id);
  }

  createOne(createTicketDto: TicketEntity) {
    return this.ticketRepository.create(createTicketDto);
  }
}
