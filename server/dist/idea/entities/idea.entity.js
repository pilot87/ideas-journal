"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ideas = void 0;
const main_1 = require("../../main");
const duplicate_filter_1 = require("../../duplicate.filter");
class Ideas {
    static async add(createIdeaDto, author) {
        await main_1.db
            .any('INSERT INTO ideas (ideaname, username, describtion, short_desc, link)' +
            'VALUES (${ideaname}, ${username}, ${describtion}, ${short_desc}, ${link});', {
            ideaname: createIdeaDto.ideaname,
            username: author,
            describtion: createIdeaDto.describtion,
            short_desc: createIdeaDto.short_desc,
            link: createIdeaDto.link,
        })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
        for (const tag of createIdeaDto.tags) {
            await main_1.db.any('INSERT INTO tags (tagname) VALUES (${tagname}) ON CONFLICT DO NOTHING;', { tagname: tag });
            await main_1.db.any('INSERT INTO ideastags (ideaname, tagname) VALUES (${ideaname}, ${tagname}) ON CONFLICT DO NOTHING;', { ideaname: createIdeaDto.ideaname, tagname: tag });
        }
        return (await main_1.db.any('SELECT id FROM ideas WHERE ideaname=${ideaname}', {
            ideaname: createIdeaDto.ideaname,
        }))[0].id;
    }
    static async list() {
        return await main_1.db.any('SELECT ideaname, username author, short_desc, status, id FROM ' +
            'ideas ORDER BY author, ideaname');
    }
    static async listt() {
        return await main_1.db.any('SELECT ideaname, tagname FROM ideas NATURAL JOIN ideastags NATURAL JOIN tags');
    }
    static async listbyuser(name) {
        return await main_1.db.any('SELECT ideaname i, username author, short_desc, tagname, status FROM ideas ' +
            'NATURAL LEFT OUTER JOIN ideastags NATURAL JOIN tags WHERE username = ${username} ' +
            'ORDER BY author, i;', { username: name });
    }
    static async getByName(ideaname) {
        return await main_1.db.any('SELECT ideaname, username author, short_desc, tagname tags, describtion, "link", status FROM ' +
            'ideas NATURAL LEFT OUTER JOIN ideastags NATURAL LEFT JOIN tags WHERE ideaname = ${ideaname} ' +
            'ORDER BY ideaname;', { ideaname: ideaname });
    }
    static async getNameByID(id) {
        return (await main_1.db.any('SELECT ideaname FROM ideas WHERE id=${id}', { id: id }))[0].ideaname;
    }
    static async getIdeaComments(idea) {
        return await main_1.db.any('SELECT * FROM ' +
            'ideas LEFT OUTER JOIN comments USING (ideaname) WHERE ideaname = ${idea};', { idea: idea });
    }
    static async newComment(createCommentDto, author) {
        return await main_1.db.any('INSERT INTO comments (ideaname, commenttext, username) VALUES ' +
            '(${ideaname}, ${commenttext}, ${username});', {
            ideaname: createCommentDto.ideaname,
            commenttext: createCommentDto.text,
            username: author,
        });
    }
}
exports.Ideas = Ideas;
//# sourceMappingURL=idea.entity.js.map