import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StanEvent } from 'src/stan-events/entity/stan-event.entity';
import { StanEventsService } from 'src/stan-events/stan-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([StanEvent])],
  providers: [StanEventsService],
  exports: [StanEventsService],
})
export class StanEventsModule {}
