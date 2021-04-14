import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '../src/app.module'

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
  let app: INestApplication

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
      .get('/api/idea/list')
      .set({ authorization: 'Bearer ' + res.body.token + '0' })
    expect(res1.status).toBe(403)
    expect(res1.body.message).toEqual('Forbidden resource')
  })
})

describe('Idea module', () => {
  let app: INestApplication,
    link,
    customer,
    freelancer,
    password0,
    password1,
    ideaname

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
    link =
      'https://www.figma.com/file/DfKkzBDEzeK3fcTKmpHJSw/Travel-App-Concept?node-id=0%3A1'
    customer = gen_username(5)
    freelancer = gen_username(5)
    password0 = gen_password()
    password1 = gen_password()
    ideaname = gen_username(5)
  })

  it('should create idea', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    const token = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password0,
      })
    ).body.token

    // console.log(token)

    const res = await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ Authorization: 'Bearer ' + token })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        tags: ['Tag0', 'Tag1'],
        link: link,
      })
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Idea created')
  })

  it('should unique duplicate tags and run', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    const token = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password0,
      })
    ).body.token

    const res = await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ Authorization: 'Bearer ' + token })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        tags: ['Tag0', 'Tag0'],
        link: link,
      })
    // console.log(res.body.message)
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Idea created')
  })

  // it('should get list of ideas', async () => {
  //   await request(app.getHttpServer()).post('/api/auth/register').send({
  //     username: freelancer,
  //     email: gen_email(),
  //     password: password0,
  //     test: true,
  //   })
  //
  //   await request(app.getHttpServer()).post('/api/auth/register').send({
  //     username: customer,
  //     email: gen_email(),
  //     password: password1,
  //     test: true,
  //   })
  //
  //   const token0 = (
  //     await request(app.getHttpServer()).post('/api/auth/login').send({
  //       username: freelancer,
  //       password: password0,
  //     })
  //   ).body.token
  //
  //   const token1 = (
  //     await request(app.getHttpServer()).post('/api/auth/login').send({
  //       username: customer,
  //       password: password1,
  //     })
  //   ).body.token
  //
  //   await request(app.getHttpServer())
  //     .post('/api/idea/create')
  //     .set({ authorization: 'Bearer ' + token1 })
  //     .send({
  //       ideaname: ideaname,
  //       describtion: 'Some describtion',
  //       short_desc: 'Some short describtion',
  //       link: link,
  //       tags: ['Tag0', 'Tag1'],
  //     })
  //
  //   const res0 = await request(app.getHttpServer())
  //     .get('/api/idea/list')
  //     .set({ authorization: 'Bearer ' + token0 })
  //   expect(res0.status).toBe(200)
  //   expect(res0.body.message).toEqual('List')
  //   expect(res0.body.list).toBeDefined()
  //   expect(typeof res0.body.list).toBe('array')
  //   expect(typeof res0.body.list[0]).toBe('object')
  //   expect(res0.body.list[0].author).toEqual(customer)
  //   expect(res0.body.list[0].short_desc).toEqual('Some short describtion')
  //   expect(res0.body.list[0].link).toEqual(link)
  // })
})
