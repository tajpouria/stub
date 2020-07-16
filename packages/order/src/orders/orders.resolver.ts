import {
  UseGuards,
  NotFoundException,
  ForbiddenException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import {
  Logger,
  JwtPayload,
  ValidationPipe,
  OrderStatus,
} from '@tajpouria/stub-common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';

import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';
import { GqlJwtPayloadExtractor } from 'src/auth/gql-jwt-payload-extractor';
import {
  createOrderDto,
  CreateOrderInput,
} from 'src/orders/dto/create-order.dto';
import { TicketsService } from 'src/tickets/tickets.service';
import { OrderCreatedStanEvent } from 'src/stan-events/entity/order-created-stan-event.entity';

const { ORDER_EXPIRATION_WINDOW_SECONDS } = process.env;

@Resolver(of => OrderEntity)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly ticketsService: TicketsService,
    private readonly stanEventsService: StanEventsService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {}

  private readonly logger = Logger(`${process.cwd()}/logs/orders-resolver`);

  @UseGuards(GqlAuthGuard)
  @Query(returns => [OrderEntity])
  async orders(@GqlJwtPayloadExtractor() jwtPayload: JwtPayload) {
    return this.ordersService.findAll({ userId: jwtPayload.sub });
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => OrderEntity)
  async order(
    @Args('id') id: string,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    // Verify document existence
    const doc = await this.ordersService.findOne({ id });
    if (!doc) return new NotFoundException();

    // Verify document ownership
    const isDocOwner = doc.userId === jwtPayload.sub;
    if (!isDocOwner) return new ForbiddenException();

    return doc;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => OrderEntity)
  async createOrder(
    @Args('createOrderInput', new ValidationPipe(createOrderDto))
    { ticketId }: CreateOrderInput,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const {
      ticketsService,
      ordersService,
      stanEventsService,
      databaseTransactionService,
      logger,
    } = this;

    try {
      // Verify document existence
      const ticket = await ticketsService.findOne(ticketId);
      if (!ticket) return new NotFoundException();

      // Verify ticket is not already reserved
      const isReserved = await ticket.isReserved();
      if (isReserved) return new BadRequestException();

      // Set Expiration Date
      const expiresAt = new Date();
      expiresAt.setSeconds(
        expiresAt.getSeconds() + +ORDER_EXPIRATION_WINDOW_SECONDS,
      );

      // Create record
      const order = ordersService.createOne({
        status: OrderStatus.Created,
        userId: jwtPayload.sub,
        expiresAt: expiresAt.toISOString(),
        ticket,
      });

      // Create event
      const orderCreatedStanEvent = stanEventsService.createOneOrderCreated({
        ...order,
      });

      //Save record and event in context of same database transaction
      const [createdOrder] = await databaseTransactionService.process<
        [OrderEntity, OrderCreatedStanEvent]
      >([
        [order, 'save'],
        [orderCreatedStanEvent, 'save'],
      ]);

      return createdOrder;
    } catch (error) {
      logger.error(new Error(error));

      return new InternalServerErrorException();
    }
  }
}
