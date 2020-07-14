import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { StanEventsService } from 'src/stan-events/stan-events.service';

describe('stan-events.service (unit)', () => {
  let app: INestApplication, service: StanEventsService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    service = moduleFixture.get<StanEventsService>(StanEventsService);
  });

  afterAll(async () => {
    await app.close();
  });

  it.todo('createOneTicketCreated(): Create ticketCreateStanEvent template');
});
