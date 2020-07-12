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

  it('createOneTicketCreated(): Create ticketCreateStanEvent template', async () => {
    const newRecord = service.createOneTicketCreated({
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
      id: '123',
    });

    expect(newRecord.id).toBeDefined();
    expect(newRecord.published).toBe(false);
  });
});
