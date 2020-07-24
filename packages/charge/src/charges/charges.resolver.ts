import {
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Logger, JwtPayload, ValidationPipe } from '@tajpouria/stub-common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';

import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';
import { GqlJwtPayloadExtractor } from 'src/auth/gql-jwt-payload-extractor';
import { ChargesService } from 'src/charges/charges.service';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
import { createChargeDto, CreateChargeInput } from 'src/charges/dto/create-charge.dto';

@Resolver(of => OrderEntity)
export class ChargesResolver {
  constructor(
    private readonly chargesService: ChargesService,
    private readonly ordersService: OrdersService,
    private readonly stanEventsService: StanEventsService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {}

  private readonly logger = Logger(`${process.cwd()}/logs/orders-resolver`);

  @UseGuards(GqlAuthGuard)
  @Query(returns => [ChargeEntity])
  async charges(@GqlJwtPayloadExtractor() jwtPayload: JwtPayload) {
    return this.chargesService.findAll({ userId: jwtPayload.sub });
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => ChargeEntity)
  async charge(
    @Args('id') id: string,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    // Verify document existence
    const doc = await this.chargesService.findOne({ id });
    if (!doc) return new NotFoundException();

    // Verify document ownership
    const isDocOwner = doc.userId === jwtPayload.sub;
    if (!isDocOwner) return new ForbiddenException();

    return doc;
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(returns => ChargeEntity)
  async createCharge(
    @Args('createChargeInput', new ValidationPipe(createChargeDto))
    { orderId }: CreateChargeInput,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    // const {
    //   ordersService: ticketsService,
    //   chargesService: ordersService,
    //   stanEventsService,
    //   databaseTransactionService,
    //   logger,
    // } = this;
    // try {
    //   // Verify document existence
    //   const ticket = await ticketsService.findOne(ticketId);
    //   if (!ticket) return new NotFoundException();
    //   // Verify ticket is not already reserved
    //   const isReserved = await ticketsService.isReserved(ticket);
    //   if (isReserved) return new BadRequestException();
    //   // Set Expiration Date
    //   const expirationDate = new Date();
    //   expirationDate.setSeconds(
    //     expirationDate.getSeconds() + +ORDER_EXPIRATION_WINDOW_SECONDS,
    //   );
    //   // Create record
    //   const order = ordersService.createOne({
    //     status: OrderStatus.Created,
    //     userId: jwtPayload.sub,
    //     expiresAt: expirationDate.toISOString(),
    //     ticket,
    //   });
    //   // Create event
    //   const { id, expiresAt, status, userId, version } = order;
    //   const orderCreatedStanEvent = stanEventsService.createOneOrderCreated({
    //     id,
    //     expiresAt,
    //     status,
    //     userId,
    //     version,
    //     ticket: {
    //       id: ticket.id,
    //       price: ticket.price,
    //       timestamp: ticket.timestamp,
    //       title: ticket.title,
    //       userId: ticket.userId,
    //     },
    //   });
    //   //Save record and event in context of one database transaction
    //   const [createdOrder] = await databaseTransactionService.process<
    //     [OrderEntity, OrderCreatedStanEvent]
    //   >([order, 'save'], [orderCreatedStanEvent, 'save']);
    //   return createdOrder;
    // } catch (error) {
    //   logger.error(new Error(error));
    //   return new InternalServerErrorException();
    // }
  }
}
