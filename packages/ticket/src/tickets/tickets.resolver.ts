import {
  UseGuards,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { JwtPayload, ValidationPipe } from '@tajpouria/stub-common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { TicketsService } from 'src/tickets/tickets.service';
import {
  CreateTicketInput,
  createTicketDto,
} from 'src/tickets/dto/create-ticket.dto';
import {
  updateTicketDto,
  UpdateTicketInput,
} from 'src/tickets/dto/update-ticket.dto';
import { GqlJwtPayloadExtractor } from 'src/auth/gql-jwt-payload-extractor';

@Resolver(of => Ticket)
export class TicketsResolver {
  constructor(private readonly ticketsService: TicketsService) {}

  @UseGuards(GqlAuthGuard)
  @Query(returns => [Ticket])
  async tickets() {
    return this.ticketsService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => Ticket)
  async ticket(@Args('id') id: string) {
    const doc = await this.ticketsService.findOne(id);

    if (!doc) throw new NotFoundException();

    return doc;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async createTicket(
    @Args('createTicketInput', new ValidationPipe(createTicketDto))
    createTicketInput: CreateTicketInput,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    return this.ticketsService.createOne({
      ...createTicketInput,
      userId: jwtPayload.sub,
    });
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async updateTicket(
    @Args('id') id: string,
    @Args('updateTicketInput', new ValidationPipe(updateTicketDto))
    updateTicketInput: UpdateTicketInput,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const { ticketsService } = this;

    const ticket = await ticketsService.findOne(id);
    if (!ticket) throw new NotFoundException();

    const notTicketOwner = jwtPayload.sub !== ticket.userId;
    if (notTicketOwner) throw new UnauthorizedException();

    return this.ticketsService.updateOne(id, updateTicketInput);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async removeTicket(
    @Args('id') id: string,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const { ticketsService } = this;

    const ticket = await ticketsService.findOne(id);
    if (!ticket) throw new NotFoundException();

    const notTicketOwner = jwtPayload.sub !== ticket.userId;
    if (notTicketOwner) throw new UnauthorizedException();

    await this.ticketsService.removeOne(id);

    return ticket;
  }
}
