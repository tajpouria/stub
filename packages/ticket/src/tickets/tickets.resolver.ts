import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { TicketsService } from 'src/tickets/tickets.service';
import {
  CreateTicketInput,
  createTicketDto,
} from 'src/tickets/dto/create-ticket.dto';
import { JwtPayloadExtractor } from 'src/auth/jwtPayloadExtractor';
import { JwtPayload } from 'src/interfaces/session';
import { ValidationPipe } from 'src/shared/validationPipe';

@Resolver(of => Ticket)
export class TicketsResolver {
  constructor(private readonly ticketsServicer: TicketsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [Ticket])
  async tickets() {
    return this.ticketsServicer.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => [Ticket])
  async ticket(@Args('id') id: string) {
    return this.ticketsServicer.findOne(id);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async createTicket(
    @Args('createTicketInput', new ValidationPipe(createTicketDto))
    createTicketInput: CreateTicketInput,
    @JwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    return this.ticketsServicer.createOne({
      ...createTicketInput,
      userId: jwtPayload.sub,
    });
  }
}
