import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { Ticket } from 'src/tickets/entity/ticket.entity';
import { TicketsModule } from 'src/tickets/tickets.module';
import { StanEvent } from 'src/stan-events/entity/stan-event.entity';
import { StanEventsModule } from 'src/stan-events/stan-events.module';
import { TicketsStanEventsTransactionModule } from 'src/tickets-stan-events-transaction/tickets-stan-events-transaction.module';

const { NODE_ENV, ORM_CONFIG } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      ...JSON.parse(ORM_CONFIG),
      entities: [Ticket, StanEvent],
      synchronize: true,
      logging: NODE_ENV === 'development' ? true : ['error'],
    }),

    AuthModule,
    TicketsModule,
    StanEventsModule,
    TicketsStanEventsTransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
