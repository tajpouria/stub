import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import request from 'supertest';
import cookieSession from 'cookie-session';
import { Repository, getConnection } from 'typeorm';
import {
  HttpMessage,
  cookieGeneratorFactory,
  produceObjectVariable,
} from '@tajpouria/stub-common';
import { v4 } from 'uuid';

import { AppModule } from 'src/app.module';
import { Ticket } from 'src/tickets/entity/ticket.entity';
// __mocks__
import { stan } from 'src/shared/stan';

const { NAME, SESSION_NAME, JWT_SECRET } = process.env;

describe('app.controller (e2e)', () => {
  let app: INestApplication, ticketRepository: Repository<Ticket>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.use(
      cookieSession({
        name: SESSION_NAME,
        signed: false,
        httpOnly: true,
      }),
    );

    await app.init();

    ticketRepository = getConnection().getRepository(Ticket);
  });

  afterAll(async () => {
    await app.close();
  });

  describe(`Hello Ticket! (/api/${NAME})`, () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get('/api/ticket')
        .expect(200);
    });
  });

  const gCall = (query: string, cookie = ['']) =>
    request(app.getHttpServer())
      .post(`/api/${NAME}/graphql`)
      .set('Cookie', cookie)
      .send({
        operationName: null,
        query,
      });

  const generateCookie = cookieGeneratorFactory(SESSION_NAME, JWT_SECRET);

  describe(`POST api/${NAME}/graphql`, () => {
    describe('query tickets', () => {
      it('Tickets', async () => {
        const query = `
          {
            tickets {
              id
            }
          }
        `;

        const response = await gCall(query, generateCookie());
        expect(response.body.data).not.toBeNull();
        expect(response.body.data.tickets.length).toBeDefined();
      });
    });

    describe('query ticket(id)', () => {
      it('Document not exists: Not Found', async () => {
        const query = `
          {
            ticket(id: "abc1") {
              id
            }
          }
        `;

        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new NotFoundException().message,
        );
      });

      it('Ticket', async () => {
        const vars = {
          title: 'hello',
          description: 'hello',
          price: 99.99,
          lat: 12.1,
          lng: 14.2,
          timestamp: 1593781663193,
          userId: 'mock20%id',
        };

        const doc = await ticketRepository.save(ticketRepository.create(vars));

        const query = `
          {
            ticket(id: "${doc.id}") {
              id
              title
            }
          }
        `;

        const response = await gCall(query, generateCookie());
        expect(response.body.data.ticket.id).toBe(doc.id);
        expect(response.body.data.ticket.title).toBe(vars.title);
      });
    });

    describe('mutation createTicket', () => {
      it('Unauthorized: Unauthorized', async () => {
        const vars = {
          title: 'hello',
          description: 'hello',
          price: 99.99,
          lat: 12.1,
          lng: 14.2,
          timestamp: 1593781663193,
        };

        const query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Invalid title: Bad Request Exception', async () => {
        // Invalid Title
        let vars = {
          title: '',
          description: 'hello',
          price: 99.99,
          lat: 12.1,
          lng: 14.2,
          timestamp: Date.now(),
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid price or timestamp: Bad Request Exception', async () => {
        // Invalid price
        let vars = {
          title: 'hello',
          description: 'hello',
          price: 0,
          lat: 12.1,
          lng: 14.2,
          timestamp: Date.now(),
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid timestamp
        vars = Object.assign(vars, {
          price: '100',
          timestamp: 100,
        });

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid imageUrl or description or address: Bad Request Exception', async () => {
        // Invalid imageUrl
        let vars = {
          title: 'hello',
          description: 'hello',
          price: 100,
          lat: -12.1,
          lng: 15.3,
          timestamp: Date.now(),
          imageUrl: '',
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid description
        vars = Object.assign(vars, {
          imageUrl: 'sth',
          description: 'he',
        });

        query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid address
        vars = Object.assign(vars, {
          imageUrl: 'https://google.com',
          description: 'valid description',
          address: '',
        });

        query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Create ticket', async () => {
        const vars = {
          title: 'one',
          description: 'hello',
          price: 100,
          lat: -12.1,
          lng: 15.3,
          timestamp: Date.now(),
        };

        const query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                title
              }
            }
          `;

        const response = await gCall(query, generateCookie());
        expect(response.body.data.createTicket.title).toBe(vars.title);
      });

      it('Publish event', async () => {
        const vars = {
          title: 'two',
          description: 'hello',
          price: 100,
          lat: -12.1,
          lng: 15.3,
          timestamp: Date.now(),
        };

        const query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        const response = await gCall(query, generateCookie());
        expect(stan.instance.publish).toHaveBeenCalled();

        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
        ).toBe(response.body.data.createTicket.id);
        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1])
            .version,
        ).toBe(1);
      });
    });

    describe('mutation updateTicket', () => {
      let doc: Ticket;
      const userId = 'some%20id';

      beforeEach(async () => {
        const vars = {
          title: 'hello',
          description: 'hello',
          price: 100,
          lat: -12.1,
          lng: 15.3,
          timestamp: Date.now(),
          userId,
        };

        doc = await ticketRepository.save(ticketRepository.create(vars));
      });

      it('Unauthorized: Unauthorized', async () => {
        const vars = {
          title: 'updated Title',
        };

        const query = `
            mutation {
              updateTicket(id: "${
                doc.id
              }",updateTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Invalid title: Bad Request Exception', async () => {
        // Invalid Title
        let vars = {
          title: '',
          description: 'hello',
          price: 99.99,
          lat: 12.1,
          lng: 14.2,
          timestamp: Date.now(),
        };

        const query = `
            mutation {
              updateTicket(id: "NotExists", updateTicketInput: ${produceObjectVariable(
                vars,
              )}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid price or timestamp: Bad Request Exception', async () => {
        // Invalid price
        let vars = {
          title: 'hello',
          description: 'hello',
          price: 0,
          lat: 12.1,
          lng: 14.2,
          timestamp: Date.now(),
        };

        const query = `
            mutation {
              updateTicket(id: "NotExists", updateTicketInput: ${produceObjectVariable(
                vars,
              )}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid timestamp
        vars = Object.assign(vars, {
          price: '100',
          timestamp: 100,
        });

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Invalid imageUrl or description or address: Bad Request Exception', async () => {
        // Invalid description
        let vars = {
          title: 'hello',
          price: 100,
          lat: -12.1,
          lng: 15.3,
          timestamp: Date.now(),
          imageUrl: 'https://google.com',
          description: '',
        };

        let query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        let response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);

        // Invalid address
        vars = Object.assign(vars, {
          imageUrl: 'https://google.com',
          description: 'valid description',
          address: '',
        });

        query = `
            mutation {
              createTicket(createTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;

        response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(HttpMessage.BAD_REQUEST);
      });

      it('Document not exists: Not Found', async () => {
        const vars = {
          title: 'updated Title',
        };

        const query = `
            mutation {
              updateTicket(id: "NotExists", updateTicketInput: ${produceObjectVariable(
                vars,
              )}) {
                id
              }
            }
          `;

        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new NotFoundException().message,
        );
      });

      it('Not ticket owner: Forbidden', async () => {
        const vars = {
          title: 'updated Title',
        };

        const query = `
            mutation {
              updateTicket(id: "${
                doc.id
              }",updateTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new ForbiddenException().message,
        );
      });

      it('Ticket locked: BadRequest', async () => {
        // Lock the ticket
        doc.lastOrderId = v4();
        await ticketRepository.save(doc);

        const vars = {
          title: 'updated Title',
        };

        const query = `
            mutation {
              updateTicket(id: "${
                doc.id
              }",updateTicketInput: ${produceObjectVariable(vars)}) {
                id
              }
            }
          `;
        const response = await gCall(
          query,
          generateCookie({
            iat: Date.now(),
            sub: userId,
            username: 'someUserName',
          }),
        );

        expect(response.body.errors[0].message).toBe(
          new BadRequestException().message,
        );
      });

      it('Update Ticket', async () => {
        const title = 'updated Title';
        const vars = {
          title,
        };

        const query = `
            mutation {
              updateTicket(id: "${
                doc.id
              }",updateTicketInput: ${produceObjectVariable(vars)}) {
                id
                title
              }
            }
          `;
        const response = await gCall(
          query,
          generateCookie({
            iat: Date.now(),
            sub: userId,
            username: 'someUserName',
          }),
        );

        expect(response.body.data.updateTicket.id).toBe(doc.id);
        expect(response.body.data.updateTicket.title).toBe(title);
      });

      it('Publish event', async () => {
        const title = 'updated Title';
        const vars = {
          title,
        };

        const query = `
            mutation {
              updateTicket(id: "${
                doc.id
              }",updateTicketInput: ${produceObjectVariable(vars)}) {
                id
                title
              }
            }
          `;

        await gCall(
          query,
          generateCookie({
            iat: Date.now(),
            sub: userId,
            username: 'someUserName',
          }),
        );

        await gCall(query, generateCookie());
        expect(stan.instance.publish).toHaveBeenCalled();

        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
        ).toBe(doc.id);
        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1])
            .version,
        ).toBe(2);
      });
    });

    describe('mutation removeTicket', () => {
      let doc;
      const userId = 'some%20id';

      beforeEach(async () => {
        const vars = {
          title: 'hello',
          description: 'hello',
          price: 100,
          lat: -12.1,
          lng: 15.3,
          timestamp: Date.now(),
          userId,
        };

        doc = await ticketRepository.save(ticketRepository.create(vars));
      });

      it('Unauthorized: Unauthorized', async () => {
        const query = `
            mutation {
              removeTicket(id:"${doc.id}"){
                id
              }
            }
          `;

        const response = await gCall(query);
        expect(response.body.errors[0].message).toBe(HttpMessage.UNAUTHORIZED);
      });

      it('Document not exists: Not Found', async () => {
        const query = `
            mutation {
              removeTicket(id:"NotExists"){
                id
              }
            }
          `;

        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new NotFoundException().message,
        );
      });

      it('Not ticket owner: Forbidden', async () => {
        const query = `
            mutation {
              removeTicket(id:"${doc.id}"){
                id
              }
            }
          `;

        const response = await gCall(query, generateCookie());
        expect(response.body.errors[0].message).toBe(
          new ForbiddenException().message,
        );
      });

      it('Ticket locked: BadRequest', async () => {
        // Lock the ticket
        doc.lastOrderId = v4();
        await ticketRepository.save(doc);

        const query = `
            mutation {
              removeTicket(id:"${doc.id}"){
                id
              }
            }
          `;
        const response = await gCall(
          query,
          generateCookie({
            iat: Date.now(),
            sub: userId,
            username: 'someUserName',
          }),
        );
        expect(response.body.errors[0].message).toBe(
          new BadRequestException().message,
        );
      });

      it('Remove Ticket', async () => {
        const query = `
            mutation {
              removeTicket(id:"${doc.id}"){
                id
                title
              }
            }
          `;

        const response = await gCall(
          query,
          generateCookie({
            iat: Date.now(),
            sub: userId,
            username: 'someUserName',
          }),
        );

        expect(response.body.data.removeTicket.id).toBe(doc.id);
        expect(response.body.data.removeTicket.title).toBe(doc.title);
      });

      it('Publish Event', async () => {
        const query = `
            mutation {
              removeTicket(id:"${doc.id}"){
                id
                title
              }
            }
          `;

        const response = await gCall(
          query,
          generateCookie({
            iat: Date.now(),
            sub: userId,
            username: 'someUserName',
          }),
        );

        expect(stan.instance.publish).toBeCalled();

        expect(
          JSON.parse((stan.instance.publish as jest.Mock).mock.calls[0][1]).id,
        ).toBe(doc.id);
      });
    });
  });
});
