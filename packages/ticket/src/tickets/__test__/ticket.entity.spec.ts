import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';

import { TicketsService } from 'src/tickets/tickets.service';
import { Ticket } from 'src/tickets/entity/ticket.entity';
import { AppModule } from 'src/app.module';

describe('tickets.service (unit)', () => {
  let app: INestApplication,
    service: TicketsService,
    repository: Repository<Ticket>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(Ticket);

    service = moduleFixture.get<TicketsService>(TicketsService);
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM ticket;`);
  });

  afterAll(async () => {
    await app.close();
  });

  it.todo('');
});
