import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

import { AppModule } from 'src/app.module';
import { signUpUser, redis } from '../.jest/utils';
import { async } from 'rxjs/internal/scheduler/async';

describe('app.controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Hello Auth! (/api/auth)', () => {
    it('GET: 200', async () => {
      await request(app.getHttpServer())
        .get('/api/auth')
        .expect(200);
    });
  });

  describe('SignUp Local (/api/auth/signup)', () => {
    it('POST: 200', async () => {
      const email = 'abc@abc.com';

      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email,
          username: 'abc123',
          password: 'abc1234',
          repeatPassword: 'abc1234',
        })
        .expect(200)
        .expect({ email });
    });

    it('POST invalid body-Empty request body: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({})
        .expect(400);
    });

    it('POST invalid body-Invalid email: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'Invalid Email',
          username: 'abc123',
          password: 'abc1234',
          repeatPassword: 'abc1234',
        })
        .expect(400);
    });

    it('POST invalid body-Weak password: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'email@email.com',
          username: 'abc123',
          password: 'abcdefgh',
          repeatPassword: 'abcdefgh',
        })
        .expect(400);
    });

    it('POST invalid body-Not match repeatPassword: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: 'email@email.com',
          username: 'abc123',
          password: 'abc123',
          repeatPassword: '321cba',
        })
        .expect(400);
    });

    it('POST User already exists: 400', async () => {
      const user = {
        email: 'abc1234@email.com',
        username: 'abc1234',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send(user)
        .expect(400);
    });
  });

  describe('SignUp Local (/api/auth/signup/:token)', () => {
    const token = 'token';

    afterEach(async () => {
      await redis.del(token);
    });

    it('GET: 201', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer()).get(`/api/auth/signup/${token}`);
      expect(201);
    });

    it('GET: Send session', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await redis.set(token, JSON.stringify(user));

      const response = await request(app.getHttpServer()).get(
        `/api/auth/signup/${token}`,
      );

      expect(response.body.session).toBeDefined();
    });

    it('GET: Delete redis token user', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer()).get(`/api/auth/signup/${token}`);

      expect(await redis.get(token)).toBeNull();
    });

    it('GET Invalid store user: 400', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer())
        .get(`/api/auth/signup/${token}`)
        .expect(400);
    });

    it('GET Invalid token: 400', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer())
        .get(`/api/auth/signup/${token}_Invalid`)
        .expect(400);
    });

    it('GET User already exists: 400', async () => {
      const user = {
        email: 'abc@abc.com', // Invalid User do not contain username
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer())
        .get(`/api/auth/signup/${token}`)
        .expect(400);
    });
  });

  describe('SignOut (/api/auth/signout)', () => {
    it('GET: 204', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/signout')
        .expect(204);
    });
  });
});
