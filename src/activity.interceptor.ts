import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
const jwt = require('jsonwebtoken')
const config = require('config')

import { Session } from './auth/entities/auth.entity'

// update last session activity time, should be used
// only when handle user activity, not auto quarry handle
@Injectable()
export class ActivityInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const token = context
        .switchToHttp()
        .getRequest()
        .headers.authorization.split(' ')[1]
      const { session } = jwt.verify(token, config.get('jwtSecret'))
      Session.active(session)
    } finally {
      return next.handle()
    }
  }
}
