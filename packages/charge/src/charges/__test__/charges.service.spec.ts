import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Repository, getConnection } from 'typeorm';
import { OrderStatus } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { ChargeEntity } from 'src/charges/entity/charge.entity';
import { OrderEntity } from 'src/orders/entity/order.entity';
import { ChargesService } from 'src/charges/charges.service';

describe('charge.service (unit)', () => {
  let app: INestApplication,
    service: ChargesService,
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

    service = moduleFixture.get<ChargesService>(ChargesService);
  });

  afterAll(async () => {
    await app.close();
  });

  const userId = 'user-id';
  let doc: ChargeEntity;
  beforeEach(async () => {
    const order = await orderRepository.save(
      orderRepository.create({
        price: 1300,
        status: OrderStatus.Created,
        userId,
      }),
    );

    doc = await chargeRepository.save(
      chargeRepository.create({
        userId,
        order,
      }),
    );
  });

  it('findAll(): Retrieve documents', async () => {
    const charges = await service.findAll({ userId });

    expect(charges.length).toBeDefined();
    expect(charges[0].userId).toBe(userId);
    expect(charges[0].order.id).toBe(doc.order.id);
  });

  it('findOne(): Retrieve document', async () => {
    const charge = await service.findOne({ userId });

    expect(charge.userId).toBe(userId);
    expect(charge.order.id).toBe(doc.order.id);
  });

  it('createOne(): Create document template and include id', async () => {
    const order = await orderRepository.save(
      orderRepository.create({
        price: 1300,
        status: OrderStatus.Created,
        userId,
      }),
    );

    const doc = service.createOne({
      userId,
      order,
    });

    // Check Injected id
    expect(doc.id).toBeDefined();
    expect(doc.order.id).toBe(order.id);
  });
});
