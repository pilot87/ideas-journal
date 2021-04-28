import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'

import { AppModule } from '../src/app.module'

import { gen_username, gen_password, gen_email } from './e2e.lib'

// solid file use because db connection could not be closed under supertest
// and 3000 port could not be released

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

  it('should return error if password too short', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: gen_username(10),
        email: gen_email(),
        password: gen_username(5),
        test: true,
      })
    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.message)).toBe(true)
    expect(res.body.message.length).toBeGreaterThanOrEqual(1)
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
      .get('/api/idea/listall')
      .set({ authorization: 'Bearer ' + res.body.token + '0' })
    expect(res1.status).toBe(403)
    expect(res1.body.message).toEqual('Forbidden resource')
  })
})

describe('Profile module', () => {
  let login, password, token, app, newemail

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()

    login = gen_username(5)
    password = gen_password()
    newemail = gen_email()

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: login,
      email: gen_email(),
      password: password,
      test: true,
    })

    token = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: login,
        password: password,
      })
    ).body.token
  })

  it('should change email', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/profile/chemail')
      .set({ authorization: 'Bearer ' + token })
      .send({ email: newemail })
    expect(res.status).toBe(201)
    expect(res.body.token).toBeDefined()
    expect(res.body.message).toEqual('Email changed')
    expect(typeof res.body.token).toBe('string')
    expect(res.body.token.length).toBeGreaterThan(10)
  })

  it('should return error(s) if try to change email to invalid', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/profile/chemail')
      .set({ authorization: 'Bearer ' + token })
      .send({ email: gen_username(10) })
    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.message)).toBe(true)
    expect(res.body.message.length).toBeGreaterThanOrEqual(1)
  })

  it('should return error if try to change email to existing', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({
        username: gen_username(5),
        email: newemail,
        password: gen_password(),
        test: true,
      })

    const res = await request(app.getHttpServer())
      .post('/api/profile/chemail')
      .set({ authorization: 'Bearer ' + token })
      .send({ email: newemail })
    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.message)).toBe(true)
    expect(res.body.message.length).toBeGreaterThanOrEqual(1)
  })

  it('should chage email and change it again with new token', async () => {
    const res0 = await request(app.getHttpServer())
      .post('/api/profile/chemail')
      .set({ authorization: 'Bearer ' + token })
      .send({ email: newemail })

    const res1 = await request(app.getHttpServer())
      .post('/api/profile/chemail')
      .set({ authorization: 'Bearer ' + res0.body.token })
      .send({ email: newemail })
    expect(res1.status).toBe(201)
    expect(res1.body.token).toBeDefined()
    expect(res1.body.message).toEqual('Email changed')
    expect(typeof res1.body.token).toBe('string')
    expect(res1.body.token.length).toBeGreaterThan(10)
  })

  it('should change password', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/profile/chpasswd')
      .set({ authorization: 'Bearer ' + token })
      .send({ password: gen_password() })
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Password changed')
  })

  it('should return error if password too short', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/profile/chpasswd')
      .set({ authorization: 'Bearer ' + token })
      .send({ password: gen_username(5) })
    expect(res.status).toBe(400)
    expect(Array.isArray(res.body.message)).toBe(true)
    expect(res.body.message.length).toBeGreaterThanOrEqual(1)
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
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Idea created')
  })

  it('should get list of ideas', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: freelancer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password1,
      test: true,
    })

    const token0 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: freelancer,
        password: password0,
      })
    ).body.token

    const token1 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password1,
      })
    ).body.token

    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + token1 })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1'],
      })

    const res0 = await request(app.getHttpServer())
      .get('/api/idea/listall')
      .set({ authorization: 'Bearer ' + token0 })
    expect(res0.status).toBe(200)
    expect(res0.body.message).toEqual('List')
    expect(res0.body.list).toBeDefined()
    const record = res0.body.list.find((e) => e.author === customer)
    expect(record.author).toEqual(customer)
    expect(record.short_desc).toEqual('Some short describtion')
    expect(record.tags).toEqual(['Tag0', 'Tag1'])
    expect(record.status).toEqual('new')
  })

  it('should get list of ideas created by customer', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: freelancer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password1,
      test: true,
    })

    const token0 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: freelancer,
        password: password0,
      })
    ).body.token

    const token1 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password1,
      })
    ).body.token

    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + token1 })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1'],
      })

    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + token1 })
      .send({
        ideaname: ideaname + 'a',
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1'],
      })

    const res0 = await request(app.getHttpServer())
      .get('/api/idea/listbyuser/' + customer)
      .set({ authorization: 'Bearer ' + token0 })
    expect(res0.status).toBe(200)
    expect(res0.body.message).toEqual('List')
    expect(res0.body.list).toBeDefined()
    expect(res0.body.list.length).toBeGreaterThanOrEqual(2)
    expect(res0.body.list[0].status).toEqual('new')
  })

  it('should return idea', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: freelancer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password1,
      test: true,
    })

    const token0 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: freelancer,
        password: password0,
      })
    ).body.token

    const token1 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password1,
      })
    ).body.token

    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + token1 })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1', 'Tag2'],
      })

    const res = await request(app.getHttpServer())
      .get('/api/idea/getByName/' + ideaname)
      .set({ authorization: 'Bearer ' + token0 })
    expect(res.status).toBe(200)
    expect(res.body.message).toEqual('Idea')
    expect(res.body.idea.author).toEqual(customer)
    expect(res.body.idea.short_desc).toEqual('Some short describtion')
    expect(res.body.idea.tags).toEqual(['Tag0', 'Tag1', 'Tag2'])
    expect(res.body.idea.status).toEqual('new')
  })

  it('should create and return comment', async () => {
    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: freelancer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password1,
      test: true,
    })

    const token0 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: freelancer,
        password: password0,
      })
    ).body.token

    const token1 = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password1,
      })
    ).body.token

    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + token1 })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1', 'Tag2'],
      })

    const res = await request(app.getHttpServer())
      .post('/api/idea/newcomment')
      .set({ authorization: 'Bearer ' + token0 })
      .send({ ideaname: ideaname, text: 'Some comment' })
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Comment created')

    const res0 = await request(app.getHttpServer())
      .get('/api/idea/getByName/' + ideaname)
      .set({ authorization: 'Bearer ' + token0 })
    expect(res0.status).toBe(200)
    expect(res0.body.message).toEqual('Idea')
    expect(res0.body.idea.author).toEqual(customer)
    expect(res0.body.idea.short_desc).toEqual('Some short describtion')
    expect(res0.body.idea.tags).toEqual(['Tag0', 'Tag1', 'Tag2'])
    expect(res0.body.idea.comments).toEqual([
      { text: 'Some comment', author: freelancer },
    ])
  })
})

describe('Announcement module', () => {
  let app,
    customer,
    freelancer,
    password0,
    password1,
    anname,
    tokenf,
    tokenc,
    ideaslist,
    ideaname,
    link

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
    customer = gen_username(5)
    freelancer = gen_username(5)
    password0 = gen_password()
    password1 = gen_password()
    anname = gen_username(5)

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: freelancer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    tokenf = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: freelancer,
        password: password0,
      })
    ).body.token

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password1,
      test: true,
    })

    tokenc = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password1,
      })
    ).body.token

    ideaslist = (
      await request(app.getHttpServer())
        .get('/api/idea/listall')
        .set({ authorization: 'Bearer ' + tokenf })
    ).body.list.map((idea) => idea.ideaname)

    ideaname = ideaslist[Math.floor(Math.random() * ideaslist.length)]

    link =
      'https://www.figma.com/file/DfKkzBDEzeK3fcTKmpHJSw/Travel-App-Concept?node-id=0%3A1'
  })

  it('should create announcement', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Announcement created')
  })

  it('should create comment', async () => {
    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })

    const res = await request(app.getHttpServer())
      .post('/api/announcement/createcomment')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        anname: anname,
        text: 'Comment text',
      })
    expect(res.status).toBe(201)
    expect(res.body.message).toEqual('Comment created')
  })

  it('should list announcements', async () => {
    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3', 'Tag4'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/createcomment')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({
        anname: anname,
        text: 'Original comment text',
      })

    const res = await request(app.getHttpServer())
      .get('/api/announcement/list/' + ideaname)
      .set({ authorization: 'Bearer ' + tokenf })
    expect(res.status).toBe(200)
    expect(res.body.message).toEqual('List')
    expect(res.body.list.find((a) => a.anname === anname)).toEqual({
      username: freelancer,
      anname: anname,
      short_desc: 'Short desc',
      tags: ['Tag2', 'Tag3', 'Tag4'],
      comments: [
        {
          text: 'Original comment text',
          author: customer,
        },
      ],
      status: 'new',
    })
  })

  it('should return announcement by name', async () => {
    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/createcomment')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({ anname: anname, text: 'Some comment' })
    const res = await request(app.getHttpServer())
      .get('/api/announcement/getbyname/' + anname)
      .set({ authorization: 'Bearer ' + tokenf })
    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Announcement')
    expect(res.body.an).toEqual({
      ideaname: ideaname,
      username: freelancer,
      anname: anname,
      short_desc: 'Short desc',
      text: 'Announcement text',
      status: 'new',
      tags: ['Tag2', 'Tag3'],
      comments: ['Some comment'],
    })
  })

  it('should choose announcement and mode toggle idea to await status', async () => {
    ideaname = gen_username(10)
    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })

    const res0 = await request(app.getHttpServer())
      .post('/api/announcement/choose')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({ ideaname: ideaname, anname: anname })
    expect(res0.status).toBe(201)
    expect(res0.body.message).toEqual('Announcement choosed')

    const res1 = await request(app.getHttpServer())
      .get('/api/idea/listall')
      .set({ authorization: 'Bearer ' + tokenc })
    expect(res1.status).toBe(200)
    expect(res1.body.list.find((i) => i.ideaname === ideaname).status).toEqual(
      'await',
    )

    const res2 = await request(app.getHttpServer())
      .get('/api/announcement/list/' + ideaname)
      .set({ authorization: 'Bearer ' + tokenc })
    expect(res2.status).toBe(200)
    expect(res2.body.list.find((a) => a.anname === anname).status).toEqual(
      'chosen',
    )
    const res3 = await request(app.getHttpServer())
      .get('/api/announcement/getbyname/' + anname)
      .set({ authorization: 'Bearer ' + tokenc })
    expect(res3.status).toBe(200)
    expect(res3.body.an.status).toEqual('chosen')
  })
})

describe('Result module', () => {
  let app,
    customer,
    freelancer,
    password0,
    password1,
    anname,
    tokenf,
    tokenc,
    ideaname,
    link

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleFixture.createNestApplication()
    await app.init()
    customer = gen_username(5)
    freelancer = gen_username(5)
    password0 = gen_password()
    password1 = gen_password()
    anname = gen_username(5)
    ideaname = gen_username(5)

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: freelancer,
      email: gen_email(),
      password: password0,
      test: true,
    })

    tokenf = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: freelancer,
        password: password0,
      })
    ).body.token

    await request(app.getHttpServer()).post('/api/auth/register').send({
      username: customer,
      email: gen_email(),
      password: password1,
      test: true,
    })

    tokenc = (
      await request(app.getHttpServer()).post('/api/auth/login').send({
        username: customer,
        password: password1,
      })
    ).body.token

    link =
      'https://www.figma.com/file/DfKkzBDEzeK3fcTKmpHJSw/Travel-App-Concept?node-id=0%3A1'

    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({
        ideaname: ideaname,
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname + 'a',
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/choose')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({ ideaname: ideaname, anname: anname })
  })

  it('should create result', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/result/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({ ideaname: ideaname, anname: anname, comment: 'Result comment' })
    expect(res.status).toBe(201)
    expect(res.body.message).toBe('Result created')
  })

  it('should return No idea', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/result/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({
        ideaname: gen_username(10),
        anname: anname,
        comment: 'Result comment',
      })
    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(['No idea'])
  })

  it('should return Permission denied', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/result/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname,
        anname: anname,
        comment: 'Result comment',
      })
    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(['Permission denied'])
  })

  it('should return No announcement chosen', async () => {
    await request(app.getHttpServer())
      .post('/api/idea/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({
        ideaname: ideaname + 'e',
        describtion: 'Some describtion',
        short_desc: 'Some short describtion',
        link: link,
        tags: ['Tag0', 'Tag1'],
      })

    await request(app.getHttpServer())
      .post('/api/announcement/create')
      .set({ authorization: 'Bearer ' + tokenf })
      .send({
        ideaname: ideaname + 'e',
        anname: anname + 'e',
        short_desc: 'Short desc',
        text: 'Announcement text',
        tags: ['Tag2', 'Tag3'],
      })

    const res = await request(app.getHttpServer())
      .post('/api/result/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({
        ideaname: ideaname + 'e',
        anname: anname + 'e',
        comment: 'Result comment',
      })
    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(['No announcement chosen'])
  })

  it('should return Idea already completed', async () => {
    await request(app.getHttpServer())
      .post('/api/result/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({ ideaname: ideaname, anname: anname, comment: 'Result comment' })

    const res = await request(app.getHttpServer())
      .post('/api/result/create')
      .set({ authorization: 'Bearer ' + tokenc })
      .send({ ideaname: ideaname, anname: anname, comment: 'Result comment' })
    expect(res.status).toBe(400)
    expect(res.body.message).toEqual(['Idea already completed'])
  })
})
