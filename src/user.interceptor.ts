import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { Observable } from 'rxjs'
const jwt = require('jsonwebtoken')
const config = require('config')

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const token = context
      .switchToHttp()
      .getRequest()
      .headers.authorization.split(' ')[1]
    const { username } = jwt.verify(token, config.get('jwtSecret'))
    context.switchToHttp().getRequest().headers.user = username
    console.log(context.switchToHttp().getRequest().headers)
    return next.handle()
  }
}
