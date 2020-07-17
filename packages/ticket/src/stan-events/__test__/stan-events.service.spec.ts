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

  it('createOneTicketCreated(): Create ticketCreatedStanEvent template', async () => {
    const newRecord = service.createOneTicketCreated({
      version: 1,
      title: 'new Title',
      price: 100,
      timestamp: Date.now(),
      userId: 'someID',
      id: '123',
    });

    expect(newRecord.title).toBeDefined();
    expect(newRecord.published).toBe(false);
  });

  it('createOneTicketUpdated(): Create ticketUpdatedStanEvent template', async () => {
    const newRecord = service.createOneTicketUpdated({
      version: 1,
      title: 'new Title',
      price: 100,
      timestamp: Date.now(),
      userId: 'someID',
      id: '123',
    });

    expect(newRecord.title).toBeDefined();
    expect(newRecord.published).toBe(false);
  });

  it('createOneTicketRemoved(): Create ticketUpdatedStanEvent template', async () => {
    const newRecord = service.createOneTicketRemoved({
      version: 1,
      id: '123',
    });

    expect(newRecord.id).toBeDefined();
    expect(newRecord.published).toBe(false);
  });
});
