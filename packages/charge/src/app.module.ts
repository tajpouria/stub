import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UpdateIfCurrentSubscriber } from '@tajpouria/stub-common';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { OrdersModule } from 'src/orders/orders.module';

const { NODE_ENV, ORM_CONFIG } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      ...JSON.parse(ORM_CONFIG),
      entities: [OrderEntity],
      subscribers: [UpdateIfCurrentSubscriber],
      synchronize: true,
      logging: NODE_ENV === 'development' ? true : ['error'],
    }),

    OrdersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
