import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { TicketsModule } from 'src/tickets/tickets.module';
import { TicketEntity } from 'src/tickets/entity/ticket.entity';
import { OrderCreatedStanEvent } from 'src/stan-events/entity/order-created-stan-event.entity';

const { NODE_ENV, ORM_CONFIG } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      ...JSON.parse(ORM_CONFIG),
      entities: [OrderEntity, TicketEntity, OrderCreatedStanEvent],
      synchronize: true,
      logging: NODE_ENV === 'development' ? true : ['error'],
    }),

    OrdersModule,
    TicketsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}