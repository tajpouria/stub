import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import cookieSession from 'cookie-session';

import { AppModule } from 'src/app.module';
import { signUpUser, redis } from 'src/.jest/utils';

describe('app.controller (e2e)', () => {
  let app: INestApplication;

  const { SESSION_NAME } = process.env;
  beforeEach(async () => {
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
  });

  afterAll(async () => {
    await app.close();
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

    it('POST Empty request body: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({})
        .expect(400);
    });

    it('POST Invalid email: 400', async () => {
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

    it('POST Weak password: 400', async () => {
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

    it('POST Not match repeatPassword: 400', async () => {
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

  describe('SignIn Local (/api/auth/signin)', () => {
    it('POST Username signIn: 200', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc123',
          password: 'abc1234',
        })
        .expect(200);
    });

    it('POST Email signIn: 200', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc@abc.com',
          password: 'abc1234',
        })
        .expect(200);
    });

    it('POST: Set cookie session', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      const response = await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc@abc.com',
          password: 'abc1234',
        });

      expect(response.get('Set-Cookie')[0]).toBeDefined();
    });

    it('POST: Send session', async () => {
      const user = {
        email: 'abc@abc.com',
        username: 'abc123',
        password: 'abc1234',
        repeatPassword: 'abc1234',
      };

      await signUpUser(user);

      const response = await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc@abc.com',
          password: 'abc1234',
        });

      expect(response.body.session).toBeDefined();
    });

    it('POST Invalid body: 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc@abc.com',
        })
        .expect(401);
    });

    it('POST Unauthorized: 401', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc@abc.com',
          password: 'abc1234',
        })
        .expect(401);
    });
  });

  describe('UserInfo (/api/auth/me)', () => {
    const user = {
      email: 'abc@abc.com',
      username: 'abc123',
      password: 'abc1234',
      repeatPassword: 'abc1234',
    };

    const generateSignInSession = async () => {
      await signUpUser(user);

      const response = await request(app.getHttpServer())
        .post('/api/auth/signin')
        .send({
          usernameOrEmail: 'abc@abc.com',
          password: 'abc1234',
        });

      return response.get('Set-Cookie')[0];
    };

    it('GET: 200', async () => {
      const session = await generateSignInSession();

      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', session)
        .send()
        .expect(200);
    });

    it('GET: Send user', async () => {
      const session = await generateSignInSession();

      const response = await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', session)
        .send();

      const { email, username } = response.body;
      expect(email).toEqual(user.email);
      expect(username).toEqual(user.username);
    });

    it('GET Unauthorized: 401', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/me')
        .send()
        .expect(401);
    });

    it('GET Invalid session: 401', async () => {
      const session = await generateSignInSession();

      await request(app.getHttpServer())
        .get('/api/auth/me')
        .set('Cookie', `${session.split('').join('.')}`)
        .send()
        .expect(401);
    });

    it('PUT: 201', async () => {
      const session = await generateSignInSession();

      await request(app.getHttpServer())
        .put('/api/auth/me')
        .set('Cookie', session)
        .send({ username: 'newUser', email: 'newEmail@newEmail.com' })
        .expect(201);
    });

    it('PUT: Send session', async () => {
      const session = await generateSignInSession();

      const response = await request(app.getHttpServer())
        .put('/api/auth/me')
        .set('Cookie', session)
        .send({ username: 'newUser', email: 'newEmail@newEmail.com' });

      expect(response.body.session).toBeDefined();
    });

    it('PUT: Set cookie session', async () => {
      const session = await generateSignInSession();

      const response = await request(app.getHttpServer())
        .put('/api/auth/me')
        .set('Cookie', session)
        .send({ username: 'newUser', email: 'newEmail@newEmail.com' });

      expect(response.get('Set-Cookie')).toBeDefined();
    });

    it('PUT Unauthorized: 401', async () => {
      await request(app.getHttpServer())
        .put('/api/auth/me')
        .send({ username: 'newUser', email: 'newEmail@newEmail.com' })
        .expect(401);
    });

    it('PUT Bad body request: 400', async () => {
      const session = await generateSignInSession();

      await request(app.getHttpServer())
        .put('/api/auth/me')
        .set('Cookie', session)
        .send({
          username: 'newUser',
          email: 'newEmail@newEmail.com',
          link: 'hello', // We do not have such link property in updateUser dto
        })
        .expect(400);
    });

    it('PUT Current user info or user already exists: 400', async () => {
      const session = await generateSignInSession();

      await request(app.getHttpServer())
        .put('/api/auth/me')
        .set('Cookie', session)
        .send({ user: user.email })
        .expect(400);
    });
  });

  describe('SignOut (/api/auth/signout)', () => {
    it('GET: 204', async () => {
      await request(app.getHttpServer())
        .get('/api/auth/signout')
        .expect(204);
    });

    it('GET: Destroy session', async () => {
      const response = await request(app.getHttpServer()).get(
        '/api/auth/signout',
      );

      expect(response.get('Set-Cookie')[0]).toEqual(
        'session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly',
      );
    });
  });

  describe('ForgotPassword (/api/auth/forgotpassword)', () => {
    const user = {
      email: 'abc@abc.com',
      username: 'abc123',
      password: 'abc1234',
      repeatPassword: 'abc1234',
    };

    it('POST: 200', async () => {
      await signUpUser(user);

      await request(app.getHttpServer())
        .post('/api/auth/forgotpassword')
        .send({ usernameOrEmail: user.username })
        .expect(200);
    });

    it('POST: Send email', async () => {
      await signUpUser(user);

      await request(app.getHttpServer())
        .post('/api/auth/forgotpassword')
        .send({ usernameOrEmail: user.username })
        .expect({ email: user.email });
    });

    it('POST Bad request body: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/forgotpassword')
        .expect(400);
    });

    it('POST User does not exist: 400', async () => {
      await request(app.getHttpServer())
        .post('/api/auth/forgotpassword')
        .send({ usernameOrEmail: user.username })
        .expect(400);
    });
  });

  describe('ForgotPassword (/api/auth/forgotpassword/:token)', () => {
    const token = 'token';

    afterEach(async () => {
      await redis.del(token);
    });

    it('GET: 200', async () => {
      const user = {
        id: '1',
        email: 'abc@abc.com',
        username: 'abc123',
        pictureURL: '123abc',
      };

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer())
        .get(`/api/auth/forgotpassword/${token}`)
        .expect(200);
    });

    it('GET: Send session', async () => {
      const user = {
        id: '1',
        email: 'abc@abc.com',
        username: 'abc123',
        pictureURL: '123abc',
      };

      await redis.set(token, JSON.stringify(user));

      const response = await request(app.getHttpServer()).get(
        `/api/auth/forgotpassword/${token}`,
      );

      expect(response.body.session).toBeDefined();
    });

    it('GET: Set cookie session', async () => {
      const user = {
        id: '1',
        email: 'abc@abc.com',
        username: 'abc123',
        pictureURL: '123abc',
      };

      await redis.set(token, JSON.stringify(user));

      const response = await request(app.getHttpServer()).get(
        `/api/auth/forgotpassword/${token}`,
      );

      expect(response.get('Set-Cookie')).toBeDefined();
    });

    it('GET Token value does not exist or value is not valid: 400', async () => {
      await request(app.getHttpServer())
        .get(`/api/auth/forgotpassword/${token}`)
        .expect(400);

      const user = {
        id: '1', // Invalid user doesn't contains username
        email: 'abc@abc.com',
        pictureURL: '123abc',
      };

      await redis.set(token, JSON.stringify(user));

      await request(app.getHttpServer())
        .get(`/api/auth/forgotpassword/${token}`)
        .expect(400);
    });
  });
});
