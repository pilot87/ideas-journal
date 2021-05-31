import { CreateResultDto } from '../dto/create-result.dto';
export declare class Result {
    static create(createResultDto: CreateResultDto): Promise<any>;
    static getbyname(name: string): Promise<any>;
}
