import { db } from '../../main'
import { DuplicateException } from '../../duplicate.filter'

export class Session {
  static async add(sessionID: string, username: string) {
    return await db
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

  static async active(sessionID: string) {
    await db.none(
      'UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE sessionID = ${sessionID};',
      { sessionID: sessionID },
    )
  }
}
