import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, getConnection } from 'typeorm';

import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrderStatus, TicketCreatedEventData } from '@tajpouria/stub-common';
import { TicketsModule } from './tickets.module';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(TicketEntity)
    private ticketRepository: Repository<TicketEntity>,
  ) {}

  findOne(id: string): Promise<TicketEntity | null> {
    return this.ticketRepository.findOne(id);
  }

  createAndSaveOne(createTicketDto: TicketCreatedEventData) {
    const { ticketRepository } = this;
    return ticketRepository.save(ticketRepository.create(createTicketDto));
  }

  /**
   * True if ticket is currently under order reservation
   * @param ticket
   */
  async isReserved(ticket: DeepPartial<TicketsModule>): Promise<boolean> {
    return !!(await getConnection()
      .getRepository(OrderEntity)
      .findOne({
        where: [
          { ticket, status: OrderStatus.Created },
          { ticket, status: OrderStatus.AwaitingPayment },
          { ticket, status: OrderStatus.Complete },
        ],
      }));
  }
}
