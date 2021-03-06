import {
  UseGuards,
  NotFoundException,
  InternalServerErrorException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
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

  @Query(returns => [Ticket])
  async tickets(
    @Args('take', { type: () => Int, defaultValue: 16 }) take: number = 16,
  ) {
    return this.ticketsService.findAll(take);
  }

  @Query(returns => Ticket)
  async ticket(@Args('id') id: string) {
    const doc = await this.ticketsService.findOne({ id });

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
      // Create document
      const ticket = ticketsService.createOne({
        ...createTicketInput,
        userId: jwtPayload.sub,
      });

      // Create event
      const { id, title, price, timestamp, userId, version, imageUrl } = ticket;
      const ticketCreatedStanEvent = stanEventsService.createOneTicketCreated({
        id,
        title,
        price,
        timestamp,
        userId,
        version,
      });

      // Save document and event in context of same database transaction
      const [createdTicket] = await databaseTransactionService.process<
        [Ticket, TicketCreatedStanEvent]
      >([ticket, 'save'], [ticketCreatedStanEvent, 'save']);

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
      // Verify document existence
      const ticket = await ticketsService.findOne({ id: argId });
      if (!ticket) return new NotFoundException();

      // Verify document ownership
      const notTicketOwner = jwtPayload.sub !== ticket.userId;
      if (notTicketOwner) return new ForbiddenException();

      // Verify that document is not locked
      const isDocLocked = ticket.lastOrderId;
      if (isDocLocked) return new BadRequestException();

      // Create event
      const { id, title, price, timestamp, userId, version } = ticket;
      const ticketUpdatedStanEvent = stanEventsService.createOneTicketUpdated({
        id,
        title,
        price,
        timestamp,
        userId,
        version: version + 1, // Document version will increment after update
      });

      // Save document and event in context of same database transaction
      const [updatedTicket] = await databaseTransactionService.process<
        [Ticket, TicketUpdatedStanEvent]
      >(
        [Object.assign(ticket, updateTicketInput), 'save'],
        [ticketUpdatedStanEvent, 'save'],
      );

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
      // Verify document existence
      const ticket = await ticketsService.findOne({ id: argId });
      if (!ticket) return new NotFoundException();

      // Verify document ownership
      const notTicketOwner = jwtPayload.sub !== ticket.userId;
      if (notTicketOwner) return new ForbiddenException();

      // Verify that document is not locked
      const isDocLocked = ticket.lastOrderId;
      if (isDocLocked) return new BadRequestException();

      // Create event
      const { id, version } = ticket;
      const ticketRemovedStanEvent = stanEventsService.createOneTicketRemoved({
        id,
        version,
      });

      // Remove document and save event in context of same database transaction
      const [removedTicket] = await databaseTransactionService.process<
        [Ticket]
      >([ticket, 'remove'], [ticketRemovedStanEvent, 'save']);

      return { ...removedTicket, id: argId }; // id field removed for some reason appended manually
    } catch (error) {
      logger.error(new Error(error));

      return new InternalServerErrorException();
    }
  }
}
