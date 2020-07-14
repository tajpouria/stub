import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { OrdersService } from 'src/orders/orders.service';

describe('tickets.service (unit)', () => {
  let app: INestApplication, service: OrdersService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    // repository = moduleFixture.get('TicketRepository');

    service = moduleFixture.get<OrdersService>(OrdersService);
  });

  afterEach(async () => {
    // await repository.query(`DELETE FROM ticket;`);
  });

  afterAll(async () => {
    await app.close();
  });

  let doc;
  beforeEach(async () => {
    // TODO: Create doc
  });

  it.todo('findAll(): Retrieve user orders');
});
