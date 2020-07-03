import { UseGuards, Session } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { GqlAuthGuard } from 'src/auth/gqlAuthGuard';
import { TicketsService } from 'src/tickets/tickets.service';
import { CreateTicketDto } from 'src/tickets/dto/createTicket.dto';
import { JwtPayloadExtractor } from 'src/auth/jwtPayloadExtractor';
import { JwtPayload } from 'src/interfaces/session';

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
    @Args('createTicketDto') createTicketDto: CreateTicketDto,
    @JwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    return this.ticketsServicer.createOne({
      ...createTicketDto,
      userId: jwtPayload.sub,
    });
  }
}
