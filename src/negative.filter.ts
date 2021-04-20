import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'

export class NegativeException {
  readonly body: any
  readonly code: number
  constructor(body: any, code?: number) {
    this.body = body
    this.code = code ? code : 400
  }
}

@Catch(NegativeException)
export class NegativeFilter implements ExceptionFilter {
  catch(exception: NegativeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(exception.code).json(exception.body)
  }
}
