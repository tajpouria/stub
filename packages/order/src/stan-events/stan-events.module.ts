import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StanEventsService } from 'src/stan-events/stan-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  providers: [StanEventsService],
  exports: [StanEventsService],
})
export class StanEventsModule {}
