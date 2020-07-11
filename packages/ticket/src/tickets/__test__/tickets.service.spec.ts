import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';

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

    repository = moduleFixture.get('TicketRepository');

    service = moduleFixture.get<TicketsService>(TicketsService);
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM ticket;`);
  });

  afterAll(async () => {
    await app.close();
  });

  let doc;
  beforeEach(async () => {
    const vars = {
      title: 'hello',
      price: 100,
      latitude: -12.1,
      longitude: 15.3,
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
    const ticket = await service.findOne(doc.id);

    expect(ticket.title).toBe(ticket.title);
  });

  it('createOne(): Create ticket template', async () => {
    const newTicket = service.createOne({
      title: 'new Title',
      price: 100,
      latitude: -12.1,
      longitude: 15.3,
      timestamp: Date.now(),
      userId: 'someID',
    });

    // Method should retrieves document
    expect(newTicket.title).toBeDefined();
  });

  it('removeOne(): Remove ticket', async () => {
    await service.removeOne(doc.id);

    const removedTicket = await service.findOne(doc.id);
    expect(removedTicket).toBeUndefined();
  });
});
