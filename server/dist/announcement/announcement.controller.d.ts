import { AnnouncementService } from './announcement.service';
import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { Request } from 'express';
import { ChooseAnnouncementDto } from './dto/choose-announcement.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class AnnouncementController {
    private readonly announcementService;
    constructor(announcementService: AnnouncementService);
    create(createAnnouncementDto: CreateAnnouncementDto, req: Request): Promise<{
        message: string;
        id: any;
    }>;
    list(idea: string): Promise<{
        message: string;
        list: any;
    }>;
    createcomment(createCommentDto: CreateCommentDto, req: Request): Promise<{
        message: string;
    }>;
    getbyID(id: string): Promise<{
        message: string;
        an: any;
    }>;
    choose(chooseAnnouncementDto: ChooseAnnouncementDto, req: Request): Promise<{
        message: string;
    }>;
}
