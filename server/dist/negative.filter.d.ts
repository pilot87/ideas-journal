import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
export declare class NegativeException {
    body: any;
    readonly code: number;
    constructor(body: any, code?: number);
}
export declare class NegativeFilter implements ExceptionFilter {
    catch(exception: NegativeException, host: ArgumentsHost): void;
}
