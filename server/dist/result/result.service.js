"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultService = void 0;
const common_1 = require("@nestjs/common");
const result_entity_1 = require("./entities/result.entity");
const idea_entity_1 = require("../idea/entities/idea.entity");
const negative_filter_1 = require("../negative.filter");
let ResultService = class ResultService {
    async create(createResultDto, author) {
        const idea = (await idea_entity_1.Ideas.getByName(createResultDto.ideaname))[0];
        if (idea === undefined) {
            throw new negative_filter_1.NegativeException({ message: 'No idea' });
        }
        if (idea.author !== author) {
            throw new negative_filter_1.NegativeException({ message: 'Permission denied' });
        }
        if (idea.status === 'new') {
            throw new negative_filter_1.NegativeException({ message: 'No announcement chosen' });
        }
        if (idea.status === 'complete') {
            throw new negative_filter_1.NegativeException({ message: 'Idea already completed' });
        }
        await result_entity_1.Result.create(createResultDto);
        return { message: 'Result created' };
    }
    async getbyID(id) {
        const name = await idea_entity_1.Ideas.getNameByID(parseInt(id));
        const text = await result_entity_1.Result.getbyname(name);
        return {
            message: 'Result',
            text: text,
        };
    }
};
ResultService = __decorate([
    common_1.Injectable()
], ResultService);
exports.ResultService = ResultService;
//# sourceMappingURL=result.service.js.map