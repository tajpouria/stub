import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { v4 } from 'uuid';
import { Repository, getConnection } from 'typeorm';
import { OrderStatus } from '@tajpouria/stub-common';

import { AppModule } from 'src/app.module';
import { OrdersService } from 'src/orders/orders.service';
import { OrderEntity } from 'src/orders/entity/order.entity';

describe('tickets.service (unit)', () => {
  let app: INestApplication,
    service: OrdersService,
    repository: Repository<OrderEntity>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    await app.init();

    repository = getConnection().getRepository(OrderEntity);

    service = moduleFixture.get<OrdersService>(OrdersService);
  });

  afterAll(async () => {
    await app.close();
  });

  const userId = 'user-id';
  let doc: OrderEntity;
  beforeEach(async () => {
    doc = await repository.save(
      repository.create({
        id: v4(),
        price: Math.random(),
        status: OrderStatus.Created,
        version: 1,
        userId,
      }),
    );
  });

  it('findAll(): Retrieve all documents', async () => {
    const orders = await service.findAll({ userId });

    expect(orders.length).toBeDefined();
    expect(orders[0].userId).toBe(userId);
  });

  it('findOne(): Retrieve document', async () => {
    const order = await service.findOne({ userId });

    expect(order.userId).toBe(userId);
  });

  it('createOne(): Create document template', async () => {
    const doc = service.createOne({
      id: v4(),
      price: Math.random(),
      status: OrderStatus.Created,
      version: 1,
      userId,
    });

    expect(doc.id).toBeDefined();
  });

  it('saveOne(): Save the document', async () => {
    const doc = repository.create({
      id: v4(),
      price: Math.random(),
      status: OrderStatus.Created,
      version: 1,
      userId,
    });

    await service.saveOne(doc);

    expect(await repository.findOne(doc.id)).toBeDefined();
  });
});
