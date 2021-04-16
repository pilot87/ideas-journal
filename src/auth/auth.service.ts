import { Injectable } from '@nestjs/common'
const cryptoRandomString = require('crypto-random-string')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const config = require('config')

import { CreateUserDto } from './dto/create-user.dto'
import { LoginDto } from './dto/login.dto'
import { User } from './entities/user.entity'
import { Session } from './entities/session.entity'

@Injectable()
export class AuthService {
  async register(createAuthDto: CreateUserDto) {
    createAuthDto.password = await bcrypt.hash(createAuthDto.password, 12)
    await User.add(createAuthDto)
    return { message: 'User registered' }
  }

  async login(loginDto: LoginDto) {
    const user = await User.findOneByName(loginDto.username)

    if (!user) {
      return { status: 400, message: 'User not found', token: '' }
    }

    const isMatch = await bcrypt.compare(loginDto.password, user.password)
    if (!isMatch) {
      return { status: 400, message: 'Wrong password', token: '' }
    }

    const session = cryptoRandomString({ length: 20, type: 'base64' })

    await Session.add(session, user.username)

    const token = jwt.sign(
      {
        session: session,
        username: user.username,
        email: user.email,
      },
      config.get('jwtSecret'),
    )

    return { message: 'Logged in', token: token }
  }
}
