import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateIfCurrentSubscriber } from '@tajpouria/stub-common';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrdersModule } from 'src/orders/orders.module';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
import { ChargesModule } from 'src/charges/charges.module';
import { OrderCompletedStanEvent } from 'src/stan-events/entity/order-completed-stan-event.entity';

const { NAME, NODE_ENV, ORM_CONFIG } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
      path: `/api/${NAME}/graphql`,
    }),
    TypeOrmModule.forRoot({
      ...JSON.parse(ORM_CONFIG),
      entities: [OrderEntity, ChargeEntity, OrderCompletedStanEvent],
      subscribers: [UpdateIfCurrentSubscriber],
      synchronize: true,
      logging: NODE_ENV === 'development' ? true : ['error'],
    }),

    ChargesModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
