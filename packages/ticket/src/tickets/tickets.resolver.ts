import {
  UseGuards,
  NotFoundException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { JwtPayload, ValidationPipe, Logger } from '@tajpouria/stub-common';
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
import { ticketCreatedPublisher } from 'src/tickets/shared/ticket-created-publisher';
import { ticketUpdatedPublisher } from 'src/tickets/shared/ticket-updated-publisher';
import { ticketRemovedPublisher } from 'src/tickets/shared/ticket-removed-publisher';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { TicketsStanEventsTransactionService } from 'src/tickets-stan-events-transaction/tickets-stan-events-transaction.service';
import { StanEvent } from 'src/stan-events/entity/stan-event.entity';

@Resolver(of => Ticket)
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly stanEventsService: StanEventsService,
    private readonly ticketsStanEventsTransactionService: TicketsStanEventsTransactionService,
  ) {}

  private readonly logger = Logger(`${process.cwd()}/logs/app`);

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
    const {
      ticketsService,
      stanEventsService,
      ticketsStanEventsTransactionService,
      logger,
    } = this;

    let createdTicket: Ticket | undefined,
      createdTicketCreatedStanEvent: StanEvent | undefined;

    try {
      // Create record
      const ticket = ticketsService.createOne({
        ...createTicketInput,
        userId: jwtPayload.sub,
      });

      // Create event
      const { id, title, price, timestamp, userId } = ticket;
      const ticketCreatedStanEvent = stanEventsService.createOne({
        id,
        title,
        price,
        timestamp,
        userId,
      });

      // Save record and event in context of same database transaction
      [
        createdTicket,
        createdTicketCreatedStanEvent,
      ] = await ticketsStanEventsTransactionService.saveTicketAndStanEventTransaction(
        ticket,
        ticketCreatedStanEvent,
      );

      // Publish associated event
      await ticketCreatedPublisher.publish(createdTicketCreatedStanEvent);

      return createdTicket;
    } catch (error) {
      logger.error(new Error(error));

      // Remove record in cases that exception happened
      if (createdTicket) await ticketsService.removeOne(createdTicket.id);

      return new InternalServerErrorException();
    } finally {
      // Remove event in all circumstances
      if (createdTicketCreatedStanEvent)
        await stanEventsService.removeOne(createdTicketCreatedStanEvent.id);
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async updateTicket(
    @Args('id') argId: string,
    @Args('updateTicketInput', new ValidationPipe(updateTicketDto))
    updateTicketInput: UpdateTicketInput,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const {
      ticketsService,
      stanEventsService,
      ticketsStanEventsTransactionService,
      logger,
    } = this;

    let updatedTicket: Ticket | undefined,
      createdTicketUpdatedStanEvent: StanEvent | undefined;

    try {
      // Verify ticket existence
      const ticket = await ticketsService.findOne(argId);
      if (!ticket) return new NotFoundException();

      // Verify ticket owner
      const notTicketOwner = jwtPayload.sub !== ticket.userId;
      if (notTicketOwner) return new UnauthorizedException();

      // Create event
      const { id, title, price, timestamp, userId } = ticket;
      const ticketUpdatedStanEvent = stanEventsService.createOne({
        id,
        title,
        price,
        timestamp,
        userId,
      });

      // Save record and event in context of same database transaction

      [
        updatedTicket,
        createdTicketUpdatedStanEvent,
      ] = await ticketsStanEventsTransactionService.saveTicketAndStanEventTransaction(
        Object.assign(ticket, updateTicketInput),
        ticketUpdatedStanEvent,
      );

      // Publish associated event
      await ticketUpdatedPublisher.publish(createdTicketUpdatedStanEvent);

      return updatedTicket;
    } catch (error) {
      logger.error(new Error(error));

      // Remove record in cases that exception happened
      if (updatedTicket) await ticketsService.removeOne(updatedTicket.id);

      return new InternalServerErrorException();
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async removeTicket(
    @Args('id') argId: string,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const { ticketsService } = this;

    const ticket = await ticketsService.findOne(argId);
    if (!ticket) throw new NotFoundException();

    const notTicketOwner = jwtPayload.sub !== ticket.userId;
    if (notTicketOwner) throw new UnauthorizedException();

    await this.ticketsService.removeOne(argId);

    await ticketRemovedPublisher.publish({ id: ticket.id });

    return ticket;
  }
}
