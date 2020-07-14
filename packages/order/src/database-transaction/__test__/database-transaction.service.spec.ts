import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from 'src/app.module';
import { DatabaseTransactionService } from 'src/database-transaction/database-transaction.service';

describe('database-transaction.service (unit)', () => {
  let app: INestApplication, service: DatabaseTransactionService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    service = moduleFixture.get<DatabaseTransactionService>(
      DatabaseTransactionService,
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('process(): To be defined', async () => {
    expect(service.process).toBeDefined();
  });
});
