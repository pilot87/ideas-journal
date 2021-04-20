import { DuplicateException } from '../../duplicate.filter'

import { CreateUserDto } from '../dto/create-user.dto'

import { db } from '../../main'

export class User {
  static async add(createUserDto: CreateUserDto) {
    if (createUserDto.test) {
      return await db
        .any(
          'INSERT INTO users (username, password, email, test) VALUES ' +
            '(${username}, ${password}, ${email}, ${test});',
          {
            username: createUserDto.username,
            password: createUserDto.password,
            email: createUserDto.email,
            test: createUserDto.test,
          },
        )
        .catch((e) => {
          throw new DuplicateException(e['detail'])
        })
    } else {
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
  static async findOneByName(name: string) {
    return (
      await db.any('SELECT * FROM users WHERE username = ${name}', {
        name: name,
      })
    )[0]
  }
}
