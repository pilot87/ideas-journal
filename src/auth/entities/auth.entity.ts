import { DuplicateException } from '../duplicate.filter'

const config = require('config')
const pgp = require('pg-promise')({})

import { CreateUserDto } from '../dto/create-user.dto'

const db = pgp(config.get('connection_string'))

export class User {
  static async add(createUserDto: CreateUserDto) {
    return await db
      .any(
        'INSERT INTO users (username, password, email) VALUES ' +
          '(${username}, ${password}, ${email});',
        {
          username: createUserDto.username,
          password: createUserDto.password,
          email: createUserDto.email,
        },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
  }
}
