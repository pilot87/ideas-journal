import { CreateResultDto } from './dto/create-result.dto';
export declare class ResultService {
    create(createResultDto: CreateResultDto, author: string): Promise<{
        message: string;
    }>;
    getbyID(id: string): Promise<{
        message: string;
        text: any;
    }>;
}
