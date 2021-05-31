"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnnouncementService = void 0;
const common_1 = require("@nestjs/common");
const announcement_entity_1 = require("./entities/announcement.entity");
const idea_entity_1 = require("../idea/entities/idea.entity");
const negative_filter_1 = require("../negative.filter");
let AnnouncementService = class AnnouncementService {
    async create(createAnnouncementDto, author) {
        const id = await announcement_entity_1.Announcement.create(createAnnouncementDto, author);
        return { message: 'Announcement created', id: id };
    }
    async list(id) {
        const idea = await idea_entity_1.Ideas.getNameByID(parseInt(id));
        const announcements = await announcement_entity_1.Announcement.list(idea);
        const ideac = await announcement_entity_1.Announcement.listc(idea);
        const ideat = await announcement_entity_1.Announcement.listt(idea);
        return {
            message: 'List',
            list: announcements.map((a) => (Object.assign(Object.assign({}, a), { comments: ideac
                    .filter((c) => c.anname === a.anname)
                    .map((c) => ({ text: c.commenttext, author: c.username })), tags: ideat.filter((t) => t.anname === a.anname).map((t) => t.tagname) }))),
        };
    }
    async createcomment(createCommentDto, author) {
        await announcement_entity_1.Announcement.createcomment(createCommentDto, author);
        return { message: 'Comment created' };
    }
    async getbyID(id) {
        const anname = await announcement_entity_1.Announcement.namebyid(parseInt(id));
        const an = await announcement_entity_1.Announcement.getbyname(anname);
        return {
            message: 'Announcement',
            an: Object.assign(Object.assign({}, an), { comments: (await announcement_entity_1.Announcement.listanc(anname)).map((c) => ({
                    text: c.commenttext,
                    author: c.username,
                })), tags: (await announcement_entity_1.Announcement.listant(anname)).map((t) => t.tagname) }),
        };
    }
    async choose(chooseAnnouncementDto, author) {
        const idea = (await idea_entity_1.Ideas.getByName(chooseAnnouncementDto.ideaname))[0];
        if (idea === undefined) {
            throw new negative_filter_1.NegativeException({ message: 'No idea' });
        }
        if (idea.author !== author) {
            throw new negative_filter_1.NegativeException({ message: 'Permission denied' });
        }
        if (!(await announcement_entity_1.Announcement.getbyname(chooseAnnouncementDto.anname))) {
            throw new negative_filter_1.NegativeException({ message: 'No announcement' });
        }
        if ((await announcement_entity_1.Announcement.list(chooseAnnouncementDto.ideaname)).find((a) => a.status === 'chosen')) {
            throw new negative_filter_1.NegativeException({
                message: 'Another announcement already chosen',
            });
        }
        await announcement_entity_1.Announcement.choose(chooseAnnouncementDto);
        return { message: 'Announcement choosed' };
    }
};
AnnouncementService = __decorate([
    common_1.Injectable()
], AnnouncementService);
exports.AnnouncementService = AnnouncementService;
//# sourceMappingURL=announcement.service.js.map