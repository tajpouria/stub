import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { Ticket } from 'src/models/ticket.model';
import { AppService } from 'src/app.service';
import { GqlAuthGuard } from 'src/auth/GqlAuthGuard';

@Resolver(of => Ticket)
export class TicketResolver {
  constructor(private readonly appService: AppService) {}

  @Query(returns => Ticket)
  @UseGuards(GqlAuthGuard)
  async ticket(@Args('id', { type: () => Int, nullable: true }) id: number) {
    return { id: 1, firstName: 'Hello', lastName: 'World' };
  }
}
