import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';

import { Ticket } from 'src/tickets/entity/ticket.entity';
import { AppModule } from 'src/app.module';
import { async } from 'rxjs';

describe('tickets.entity (unit)', () => {
  let app: INestApplication, repository: Repository<Ticket>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(Ticket);
  });

  let doc: Ticket;
  beforeEach(async () => {
    doc = await repository.save(
      repository.create({
        title: 'new Title',
        price: 100,
        latitude: -12.1,
        longitude: 15.3,
        timestamp: Date.now(),
        userId: 'someID',
      }),
    );
  });

  afterEach(async () => {
    await repository.query(`DELETE FROM ticket;`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Implements Optimistic concurrency control', () => {
    it('On skipping forward', async done => {
      // Skip forward
      doc.version = 5;

      try {
        await repository.save(doc);
      } catch (error) {
        return done();
      }

      throw new Error('Expect not to reach this point');
    });

    it('On skipping backward', async done => {
      // Skip backward
      doc.version = 0;

      try {
        await repository.save(doc);
      } catch (error) {
        return done();
      }

      throw new Error('Expect not to reach this point');
    });
  });

  it('Increase document.version onUpdate', async () => {
    expect(doc.version).toBe(1);

    await repository.save(doc);
    expect(doc.version).toBe(2);

    await repository.save(doc);
    expect(doc.version).toBe(3);
  });
});
