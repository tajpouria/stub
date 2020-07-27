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

  afterAll(async () => {
    await app.close();
  });

  let doc;
  beforeEach(async () => {
    const vars = {
      title: 'hello',
      description: 'hello',
      price: 100,
      lat: -12.1,
      lng: 15.3,
      timestamp: Date.now(),
      userId: 'someID',
    };

    doc = await repository.save(repository.create(vars));
  });

  it('findAll(): Retrieve tickets', async () => {
    const tickets = await service.findAll();

    expect(tickets.length).toBeDefined();
    expect(tickets[0].title).toBe(doc.title);
  });

  it('findOne(): Retrieve ticket', async () => {
    const ticket = await service.findOne({ id: doc.id });

    expect(ticket.title).toBe(ticket.title);
  });

  it('createOne(): Create ticket template', async () => {
    const newTicket = service.createOne({
      title: 'new Title',
      description: 'hello',
      price: 100,
      lat: -12.1,
      lng: 15.3,
      timestamp: Date.now(),
      userId: 'someID',
    });

    // Check injected id
    expect(newTicket.id).toBeDefined();
    expect(newTicket.title).toBeDefined();
  });
});
