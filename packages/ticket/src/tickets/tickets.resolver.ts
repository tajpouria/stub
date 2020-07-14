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
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';
import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';
import { TicketUpdatedStanEvent } from 'src/stan-events/entity/ticket-updated-stan-event.entity';

@Resolver(of => Ticket)
export class TicketsResolver {
  constructor(
    private readonly ticketsService: TicketsService,
    private readonly stanEventsService: StanEventsService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {}

  private readonly logger = Logger(`${process.cwd()}/logs/tickets-resolver`);

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
      databaseTransactionService,
      logger,
    } = this;

    try {
      // Create record
      const ticket = ticketsService.createOne({
        ...createTicketInput,
        userId: jwtPayload.sub,
      });

      // Create event
      const { id, title, price, timestamp, userId } = ticket;
      const ticketCreatedStanEvent = stanEventsService.createOneTicketCreated({
        id,
        title,
        price,
        timestamp,
        userId,
      });

      // Save record and event in context of same database transaction
      const [createdTicket] = await databaseTransactionService.process<
        [Ticket, TicketCreatedStanEvent]
      >([
        [ticket, 'save'],
        [ticketCreatedStanEvent, 'save'],
      ]);

      return createdTicket;
    } catch (error) {
      logger.error(new Error(error));

      return new InternalServerErrorException();
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
      databaseTransactionService,
      logger,
    } = this;

    try {
      // Verify ticket existence
      const ticket = await ticketsService.findOne(argId);
      if (!ticket) return new NotFoundException();

      // Verify ticket ownership
      const notTicketOwner = jwtPayload.sub !== ticket.userId;
      if (notTicketOwner) return new UnauthorizedException();

      // Create event
      const { id, title, price, timestamp, userId } = ticket;
      const ticketUpdatedStanEvent = stanEventsService.createOneTicketUpdated({
        id,
        title,
        price,
        timestamp,
        userId,
      });

      // Save record and event in context of same database transaction
      const [updatedTicket] = await databaseTransactionService.process<
        [Ticket, TicketUpdatedStanEvent]
      >([
        [Object.assign(ticket, updateTicketInput), 'save'],
        [ticketUpdatedStanEvent, 'save'],
      ]);

      return updatedTicket;
    } catch (error) {
      logger.error(new Error(error));

      return new InternalServerErrorException();
    }
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => Ticket)
  async removeTicket(
    @Args('id') argId: string,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const {
      ticketsService,
      stanEventsService,
      databaseTransactionService,
      logger,
    } = this;

    try {
      // Verify ticket existence
      const ticket = await ticketsService.findOne(argId);
      if (!ticket) return new NotFoundException();

      // Verify ticket ownership
      const notTicketOwner = jwtPayload.sub !== ticket.userId;
      if (notTicketOwner) return new UnauthorizedException();

      // Create event
      const { id } = ticket;
      const ticketRemovedStanEvent = stanEventsService.createOneTicketRemoved({
        id,
      });

      // Remove record and save event in context of same database transaction
      const [removedTicket] = await databaseTransactionService.process<
        [Ticket]
      >([
        [ticket, 'remove'],
        [ticketRemovedStanEvent, 'save'],
      ]);

      return { ...removedTicket, id: argId }; // id field removed for some reason appended manually
    } catch (error) {
      logger.error(new Error(error));

      return new InternalServerErrorException();
    }
  }
}
