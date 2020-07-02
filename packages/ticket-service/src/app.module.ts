import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';

import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { TicketResolver } from 'src/app.resolver';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, TicketResolver],
})
export class AppModule {}
