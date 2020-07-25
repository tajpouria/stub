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
import { ChargesService } from 'src/charges/charges.service';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
import {
  createStripeChargeDto,
  CreateStripeChargeInput,
} from 'src/charges/dto/create-charge.dto';
import { stripe } from 'src/charges/shared/stripe';
import { OrderCompletedStanEvent } from '../stan-events/entity/order-completed-stan-event.entity';

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
  async createStripeCharge(
    @Args('createStripeChargeInput', new ValidationPipe(createStripeChargeDto))
    { orderId, source }: CreateStripeChargeInput,
    @GqlJwtPayloadExtractor() jwtPayload: JwtPayload,
  ) {
    const {
      ordersService,
      chargesService,
      stanEventsService,
      databaseTransactionService,
      logger,
    } = this;

    try {
      // Verify document existence
      const order = await ordersService.findOne({ id: orderId });
      if (!order) return new NotFoundException();

      // Verify document ownership
      const isDocOwner = order.userId === jwtPayload.sub;
      if (!isDocOwner) return new ForbiddenException();

      // Should not charge for cancelled or complete orders
      if (
        order.status === OrderStatus.Cancelled ||
        order.status === OrderStatus.Complete
      )
        return new BadRequestException();

      // Charging
      const chargeData = await stripe.charges.create({
        currency: 'usd',
        amount: order.price * 100,
        source,
      });

      // Create record
      const charge = chargesService.createOne({
        id: chargeData.id,
        userId: jwtPayload.sub,
        order,
      });

      // Update order
      order.status = OrderStatus.Complete;
      order.version++;

      // Create event
      const { id, version } = order;
      const orderCompletedStanEvent = stanEventsService.createOneOrderCompleted(
        { id, version },
      );

      // Save record, event, order in context of one database transaction
      const [createdCharge] = await databaseTransactionService.process<
        [ChargeEntity, OrderCompletedStanEvent, OrderEntity]
      >([charge, 'save'], [orderCompletedStanEvent, 'save'], [order, 'save']);

      return createdCharge;
    } catch (error) {
      logger.error(new Error(error));
      return new InternalServerErrorException();
    }
  }
}
