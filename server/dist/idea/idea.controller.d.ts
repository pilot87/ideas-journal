import { Request } from 'express';
import { IdeaService } from './idea.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class IdeaController {
    private readonly ideaService;
    constructor(ideaService: IdeaService);
    create(createIdeaDto: CreateIdeaDto, req: Request): Promise<{
        message: string;
        id: any;
    }>;
    listall(): Promise<{
        message: string;
        list: any;
    }>;
    listbyuser(name: string): Promise<{
        message: string;
        list: {
            idea: any;
            author: any;
            short_desc: any;
            status: any;
            tags: any;
        }[];
    }>;
    getByID(id: string): Promise<{
        message: string;
        idea: any;
    }>;
    newComment(createCommentDto: CreateCommentDto, req: Request): Promise<{
        message: string;
    }>;
}
