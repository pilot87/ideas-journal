import { ResultService } from './result.service';
import { CreateResultDto } from './dto/create-result.dto';
import { Request } from 'express';
export declare class ResultController {
    private readonly resultService;
    constructor(resultService: ResultService);
    create(createResultDto: CreateResultDto, req: Request): Promise<{
        message: string;
    }>;
    getbyname(id: string): Promise<{
        message: string;
        text: any;
    }>;
}
