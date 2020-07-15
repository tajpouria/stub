import {
  UseGuards,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { Logger, JwtPayload } from '@tajpouria/stub-common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';

import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';
import { GqlJwtPayloadExtractor } from '../auth/gql-jwt-payload-extractor';

@Resolver(of => OrderEntity)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
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
}
