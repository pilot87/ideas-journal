"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdeaService = void 0;
const common_1 = require("@nestjs/common");
const idea_entity_1 = require("./entities/idea.entity");
const negative_filter_1 = require("../negative.filter");
let IdeaService = class IdeaService {
    async create(createIdeaDto, author) {
        createIdeaDto.tags = createIdeaDto.tags.filter((v, i, a) => a.indexOf(v) === i);
        const id = await idea_entity_1.Ideas.add(createIdeaDto, author);
        return { message: 'Idea created', id: id };
    }
    async listall() {
        const ideas = await idea_entity_1.Ideas.list();
        const tags = await idea_entity_1.Ideas.listt();
        return {
            message: 'List',
            list: ideas.map((i) => (Object.assign(Object.assign({}, i), { tags: tags
                    .filter((t) => t.ideaname === i.ideaname)
                    .map((t) => t.tagname) }))),
        };
    }
    async listbyuser(name) {
        const ilist = await idea_entity_1.Ideas.listbyuser(name);
        const result = [...new Set(ilist.map((idea) => idea.i))].map((iname) => {
            const first = ilist.find((el) => el.i === iname);
            const tags = ilist.filter((el) => el.i === iname).map((el) => el.tagname);
            tags.sort();
            return {
                idea: first.i,
                author: first.author,
                short_desc: first.short_desc,
                status: first.status,
                tags: tags,
            };
        });
        return { message: 'List', list: result };
    }
    async getByID(id) {
        const idea = await idea_entity_1.Ideas.getNameByID(parseInt(id));
        const ilist = await idea_entity_1.Ideas.getByName(idea);
        if (ilist.length === 0) {
            throw new negative_filter_1.NegativeException({ message: 'No ideas found' });
        }
        const result = ilist[0];
        result.tags = ilist.map((el) => el.tags);
        delete result.tagname;
        const tlist = await idea_entity_1.Ideas.getIdeaComments(idea);
        result.comments = tlist.map((el) => ({
            text: el.commenttext,
            author: el.username,
        }));
        return { message: 'Idea', idea: result };
    }
    async newComment(createCommentDto, author) {
        await idea_entity_1.Ideas.newComment(createCommentDto, author);
    }
};
IdeaService = __decorate([
    common_1.Injectable()
], IdeaService);
exports.IdeaService = IdeaService;
//# sourceMappingURL=idea.service.js.map