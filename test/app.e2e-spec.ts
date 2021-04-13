import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../src/app.module'
import { as } from 'pg-promise'

const gen_username = (length) => {
  let result = ''
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
const gen_email = () =>
  `${gen_username(Math.floor(Math.random() * 18) + 2)}@${gen_username(
    Math.floor(Math.random() * 3) + 2,
  )}.com`
const gen_password = () => Math.random().toString(36).slice(-8)

describe('Auth module', () => {
  let app: INestApplication, db
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  it('should register new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: gen_username(10),
        email: gen_email(),
        password: gen_password(),
        test: true,
      })
    expect(res.status).toBe(201)
    expect(res.body).toEqual({ message: 'User registered' })
  })

  it('should not register new user', async () => {
    return await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: gen_username(10),
        email: gen_username(10),
        password: gen_password(),
        test: true,
      })
      .expect(400)
  })

  it('should not register the same user', async () => {
    const username = gen_username(10)
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username,
        email: gen_email(),
        password: gen_password(),
        test: true,
      })
      .expect(201)
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username,
        email: gen_password(),
        password: gen_password(),
        test: true,
      })
      .expect(400)
  })

  it('should register new user and log in', async () => {
    const username = gen_username(10)
    const password = gen_password()
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username,
        email: gen_email(),
        password: password,
        test: true,
      })
      .expect(201, { message: 'User registered' })
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: username,
        password: password,
      })
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Logged in')
    expect(typeof res.body.token).toEqual('string')
    expect(res.body.token.length).toBeGreaterThan(10)
  })

  it('should create test two users and logged in, delete they and not found deleted', async () => {
    const username0 = gen_username(10)
    const password0 = gen_password()
    const username1 = gen_username(10)
    const password1 = gen_password()
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username0,
        email: gen_email(),
        password: password0,
        test: true,
      })
      .expect(201, { message: 'User registered' })
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username1,
        email: gen_email(),
        password: password1,
        test: true,
      })
      .expect(201, { message: 'User registered' })
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: username1,
        password: password1,
      })
    await request(app.getHttpServer())
      .get('/api/auth/cleanTestsUsers')
      .set({ authorization: 'Bearer ' + res.body.token })
      .expect(200, { message: 'Test users removed' })
    return await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: username1,
        password: password1,
      })
      .expect(201, { status: 400, message: 'User not found', token: '' })
  })
  it('should forbidden auth with wrong token', async () => {
    const username0 = gen_username(10)
    const password0 = gen_password()
    const username1 = gen_username(10)
    const password1 = gen_password()
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username0,
        email: gen_email(),
        password: password0,
        test: true,
      })
      .expect(201, { message: 'User registered' })
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: username1,
        email: gen_email(),
        password: password1,
        test: true,
      })
      .expect(201, { message: 'User registered' })
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        username: username1,
        password: password1,
      })
    const res1 = await request(app.getHttpServer())
      .get('/api/auth/cleanTestsUsers')
      .set({ authorization: 'Bearer ' + res.body.token + '0' })
    expect(res1.status).toBe(403)
    expect(res1.body.message).toEqual('Forbidden resource')
    await request(app.getHttpServer())
      .get('/api/auth/cleanTestsUsers')
      .set({ authorization: 'Bearer ' + res.body.token })
      .expect(200, { message: 'Test users removed' })
  })
})

describe('Idea module', () => {
  let app: INestApplication, db
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })
  it('should create idea', async () => {
    const username = gen_username(5)
    const password = gen_password()
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: username,
      email: gen_email(),
      password: password,
      test: true,
    })
    const token = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: username,
        password: password,
      })
    ).body.token
    const res = await request(app.getHttpServer())
      .post('/api/idea/new')
      .set({ authorization: 'Bearer ' + token })
    expect(res.status).toBe(201)
  })
})
