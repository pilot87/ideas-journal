import { CreateAnnouncementDto } from './dto/create-announcement.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ChooseAnnouncementDto } from './dto/choose-announcement.dto';
export declare class AnnouncementService {
    create(createAnnouncementDto: CreateAnnouncementDto, author: string): Promise<{
        message: string;
        id: any;
    }>;
    list(id: string): Promise<{
        message: string;
        list: any;
    }>;
    createcomment(createCommentDto: CreateCommentDto, author: string): Promise<{
        message: string;
    }>;
    getbyID(id: string): Promise<{
        message: string;
        an: any;
    }>;
    choose(chooseAnnouncementDto: ChooseAnnouncementDto, author: string): Promise<{
        message: string;
    }>;
}
