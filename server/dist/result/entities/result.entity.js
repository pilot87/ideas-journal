"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Result = void 0;
const main_1 = require("../../main");
const duplicate_filter_1 = require("../../duplicate.filter");
class Result {
    static async create(createResultDto) {
        return await main_1.db
            .any("UPDATE ideas SET status = 'complete' WHERE ideaname = ${ideaname};" +
            "UPDATE announcement SET status = 'complete' WHERE anname = ${anname};" +
            'INSERT INTO results (comment, ideaname, anname) VALUES ' +
            '(${comment}, ${ideaname}, ${anname});', {
            ideaname: createResultDto.ideaname,
            anname: createResultDto.anname,
            comment: createResultDto.comment,
        })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
    }
    static async getbyname(name) {
        return (await main_1.db.any('SELECT comment FROM results WHERE ideaname=${ideaname};', {
            ideaname: name,
        }))[0].comment;
    }
}
exports.Result = Result;
//# sourceMappingURL=result.entity.js.map