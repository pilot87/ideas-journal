import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Observable } from 'rxjs'
const config = require('config')
const jwt = require('jsonwebtoken')

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const token = context
      .switchToHttp()
      .getRequest()
      .headers.authorization.split(' ')[1]
    try {
      jwt.verify(token, config.get('jwtSecret'))
      return true
    } catch (e) {
      return false
    }
  }
}
