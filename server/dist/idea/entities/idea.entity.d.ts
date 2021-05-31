import { CreateIdeaDto } from '../dto/create-idea.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
export declare class Ideas {
    static add(createIdeaDto: CreateIdeaDto, author: string): Promise<any>;
    static list(): Promise<any>;
    static listt(): Promise<any>;
    static listbyuser(name: string): Promise<any>;
    static getByName(ideaname: string): Promise<any>;
    static getNameByID(id: number): Promise<any>;
    static getIdeaComments(idea: string): Promise<any>;
    static newComment(createCommentDto: CreateCommentDto, author: string): Promise<any>;
}
