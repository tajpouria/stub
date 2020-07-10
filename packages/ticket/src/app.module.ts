import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { AuthModule } from 'src/auth/auth.module';
import { Ticket } from 'src/tickets/entity/ticket.entity';
import { TicketsModule } from 'src/tickets/tickets.module';

const { NODE_ENV, ORM_CONFIG } = process.env;

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    TypeOrmModule.forRoot({
      ...JSON.parse(ORM_CONFIG),
      entities: [Ticket],
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
