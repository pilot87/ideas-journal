import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Session } from './auth/entities/session.entity';
const jwt = require('jsonwebtoken')
const config = require('config')

// insert user header with true authorise username or empty if guest
@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    try {
      const token = context
        .switchToHttp()
        .getRequest()
        .headers.authorization.split(' ')[1]
      const { username, session } = jwt.verify(token, config.get('jwtSecret'))
      if (Session.duration(session)) {
        context.switchToHttp().getRequest().headers.user = username
      } else {
        context.switchToHttp().getRequest().headers.user = ''
      }
    } catch (e) {
      context.switchToHttp().getRequest().headers.user = ''
    }
    return next.handle()
  }
}
