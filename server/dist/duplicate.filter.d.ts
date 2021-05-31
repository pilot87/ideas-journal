import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
export declare class DuplicateException {
    detail: string;
    constructor(msg: string);
}
export declare class DuplicateFilter implements ExceptionFilter {
    catch(exception: DuplicateException, host: ArgumentsHost): void;
}
