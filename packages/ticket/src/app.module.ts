import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateIfCurrentSubscriber } from '@tajpouria/stub-common';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { Ticket } from 'src/tickets/entity/ticket.entity';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TicketCreatedStanEvent } from 'src/stan-events/entity/ticket-created-stan-event.entity';
import { TicketUpdatedStanEvent } from 'src/stan-events/entity/ticket-updated-stan-event.entity';
import { TicketRemovedStanEvent } from 'src/stan-events/entity/ticket-removed-stan-event.entity';

const { NODE_ENV, ORM_CONFIG } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      ...JSON.parse(ORM_CONFIG),
      entities: [
        Ticket,
        TicketCreatedStanEvent,
        TicketUpdatedStanEvent,
        TicketRemovedStanEvent,
      ],
      subscribers: [UpdateIfCurrentSubscriber],
      synchronize: true,
      logging: NODE_ENV === 'development' ? true : ['error'],
    }),

    AuthModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
