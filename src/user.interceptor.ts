import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
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
      const { username } = jwt.verify(token, config.get('jwtSecret'))
      context.switchToHttp().getRequest().headers.user = username
    } catch (e) {
      context.switchToHttp().getRequest().headers.user = ''
    }
    return next.handle()
  }
}
