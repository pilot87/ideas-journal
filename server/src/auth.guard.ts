import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Session } from './auth/entities/session.entity'
const config = require('config')
const jwt = require('jsonwebtoken')

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const token = context
      .switchToHttp()
      .getRequest()
      .headers.authorization.split(' ')[1]
    try {
      const { session } = jwt.verify(token, config.get('jwtSecret'))
      return Session.duration(session)
    } catch (e) {
      return false
    }
  }
}
