import { DuplicateException } from '../duplicate.filter'

import { CreateUserDto } from '../dto/create-user.dto'

import { db } from '../../main'

export class User {
  static add(createUserDto: CreateUserDto) {
    if (createUserDto.test) {
      return db
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
      return db
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
  static clean() {
    return db.any(
      'DELETE FROM sessions WHERE username IN (SELECT username FROM users WHERE test = TRUE);' +
        'DELETE FROM users WHERE test = TRUE;',
    )
  }
}

export class Session {
  static add(sessionID: string, username: string) {
    return db
      .any(
        'INSERT INTO sessions (sessionID, username) VALUES (${sessionID}, ${username});',
        { sessionID: sessionID, username: username },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
  }
  static async duration(sessionID: string) {
    if (
      (
        await db.any(
          'SELECT last_activity FROM sessions WHERE sessionID = ${sessionID}',
          { sessionID: sessionID },
        )
      )[0]
    ) {
      return (
        await db.one(
          "SELECT (CURRENT_TIMESTAMP - (SELECT last_activity FROM sessions WHERE sessionID = ${sessionID})) < INTERVAL '3 hours';",
          { sessionID: sessionID },
        )
      )['?column?']
    } else {
      return false
    }
  }
}
