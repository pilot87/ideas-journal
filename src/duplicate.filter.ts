import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common'

export class DuplicateException {
  detail: string
  constructor(msg: string) {
    this.detail = msg
  }
}
@Catch(DuplicateException)
export class DuplicateFilter implements ExceptionFilter {
  catch(exception: DuplicateException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(400).json({
      statusCode: 400,
      message: exception.detail,
      error: 'Bad Request',
    })

    // return {
    //   statusCode: 400,
    //   message: exception.detail,
    //   error: 'Bad Request',
    // }
  }
}
