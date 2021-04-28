import { Injectable } from '@nestjs/common'
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')

import { ChangeEmailDto } from './dto/change-email.dto'
import { Profile } from './entities/profile.entity'
import { ChangePasswordDto } from './dto/change-passwd.dto'

@Injectable()
export class ProfileService {
  async chemail(
    changeEmailDto: ChangeEmailDto,
    username: string,
    session: string,
  ) {
    await Profile.chemail(changeEmailDto, username)
    const token = jwt.sign(
      {
        session: session,
        username: username,
        email: changeEmailDto.email,
      },
      config.get('jwtSecret'),
    )
    return { message: 'Email changed', token: token }
  }

  async chpasswd(changePasswordDto: ChangePasswordDto, username: string) {
    const hashedpassword = await bcrypt.hash(changePasswordDto.password, 12)
    await Profile.chpasswd(hashedpassword, username)
    return { message: 'Password changed' }
  }
}
