import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { Ticket } from 'src/models/ticket.model';

@Resolver(of => Ticket)
export class TicketResolver {
  constructor() {}

  @Query(returns => Ticket)
  async ticket(@Args('id', { type: () => Int }) id: number) {
    return { id: 1, firstName: 'Hello', lastName: 'World' };
  }
}
