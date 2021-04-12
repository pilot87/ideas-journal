import { NestFactory } from '@nestjs/core'
const config = require('config')
const pgp = require('pg-promise')()

import { AppModule } from './app.module'
import { init_db } from './init_db'
import { ValidationPipe } from '@nestjs/common'

const PORT = config.get('port') || 443

export const db = pgp(config.get('connection_string'))

async function bootstrap() {
  await init_db(db)
  const app = await NestFactory.create(AppModule)
  await app.listen(3000)
}

bootstrap()
