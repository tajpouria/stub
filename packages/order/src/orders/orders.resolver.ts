import { UseGuards, NotFoundException } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Logger } from '@tajpouria/stub-common';
import { GqlAuthGuard } from 'src/auth/gql-auth-guard';

import { Order } from 'src/orders/entity/order.entity';
import { OrdersService } from 'src/orders/orders.service';
import { StanEventsService } from 'src/stan-events/stan-events.service';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';

@Resolver(of => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly stanEventsService: StanEventsService,
    private readonly databaseTransactionService: DatabaseTransactionService,
  ) {}

  private readonly logger = Logger(`${process.cwd()}/logs/orders-resolver`);

  @UseGuards(GqlAuthGuard)
  @Query(returns => [Order])
  async orders() {
    return this.ordersService.findAll();
  }

  @UseGuards(GqlAuthGuard)
  @Query(returns => Order)
  async order(@Args('id') id: string) {
    const doc = await this.ordersService.findOne(id);

    if (!doc) throw new NotFoundException();

    return doc;
  }
}
