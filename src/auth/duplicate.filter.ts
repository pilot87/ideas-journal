import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
} from '@nestjs/common'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(409).json(exception['detail'])
  }
}
