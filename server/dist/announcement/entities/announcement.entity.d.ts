import { CreateAnnouncementDto } from '../dto/create-announcement.dto';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { ChooseAnnouncementDto } from '../dto/choose-announcement.dto';
export declare class Announcement {
    static create(createAnnouncementDto: CreateAnnouncementDto, author: string): Promise<any>;
    static listc(idea: string): Promise<any>;
    static listanc(anname: string): Promise<any>;
    static listt(idea: string): Promise<any>;
    static listant(anname: string): Promise<any>;
    static list(idea: string): Promise<any>;
    static getbyname(anname: string): Promise<any>;
    static namebyid(id: number): Promise<any>;
    static createcomment(createCommentDto: CreateCommentDto, author: string): Promise<any>;
    static choose(chooseAnnouncementDto: ChooseAnnouncementDto): Promise<any>;
}
