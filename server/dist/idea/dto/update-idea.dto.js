"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateIdeaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_idea_dto_1 = require("./create-idea.dto");
class UpdateIdeaDto extends mapped_types_1.PartialType(create_idea_dto_1.CreateIdeaDto) {
}
exports.UpdateIdeaDto = UpdateIdeaDto;
//# sourceMappingURL=update-idea.dto.js.map