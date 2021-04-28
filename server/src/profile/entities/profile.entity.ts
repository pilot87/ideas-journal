import { db } from '../../main'

import { ChangeEmailDto } from '../dto/change-email.dto'
import { DuplicateException } from '../../duplicate.filter'
import { ChangePasswordDto } from '../dto/change-passwd.dto'

export class Profile {
  static async chemail(changeEmailDto: ChangeEmailDto, username: string) {
    await db
      .any('UPDATE users SET email = ${email} WHERE username = ${username}', {
        email: changeEmailDto.email,
        username: username,
      })
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
  }

  static async chpasswd(password: ChangePasswordDto, username: string) {
    await db
      .any(
        'UPDATE users SET password = ${password} WHERE username = ${username}',
        {
          password: password,
          username: username,
        },
      )
      .catch((e) => {
        throw new DuplicateException(e['detail'])
      })
  }
}
