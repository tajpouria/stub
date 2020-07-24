import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getConnection, Repository } from 'typeorm';
import { OrderStatus } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
import { StanEventsService } from 'src/stan-events/stan-events.service';

describe('stan-events.service (unit)', () => {
  let app: INestApplication,
    service: StanEventsService,
    chargeRepository: Repository<ChargeEntity>,
    orderRepository: Repository<OrderEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    chargeRepository = getConnection().getRepository(ChargeEntity);
    orderRepository = getConnection().getRepository(OrderEntity);

    service = moduleFixture.get<StanEventsService>(StanEventsService);
  });

  afterAll(async () => {
    await app.close();
  });

  let doc: ChargeEntity;
  beforeEach(async () => {
    const order = await orderRepository.save(
      orderRepository.create({
        price: 1300,
        status: OrderStatus.Created,
        userId: 'some-id',
      }),
    );

    doc = await chargeRepository.save(
      chargeRepository.create({
        userId: order.userId,
        order,
      }),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  it('createOneOrderCompleted(): Create document template', () => {
    const newRecord = service.createOneOrderCompleted(doc);

    expect(newRecord.id).toBe(doc.id);
  });
});
