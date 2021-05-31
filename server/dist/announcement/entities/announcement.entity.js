"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Announcement = void 0;
const main_1 = require("../../main");
const duplicate_filter_1 = require("../../duplicate.filter");
class Announcement {
    static async create(createAnnouncementDto, author) {
        const ideaname = (await main_1.db.any('SELECT ideaname FROM ideas WHERE id=${id};', {
            id: createAnnouncementDto.id,
        }))[0].ideaname;
        await main_1.db
            .any('INSERT INTO announcement (ideaname, username, anname, short_desc, text, link) VALUES' +
            '(${ideaname}, ${username}, ${anname}, ${short_desc}, ${text}, ${link});', {
            ideaname: ideaname,
            username: author,
            anname: createAnnouncementDto.anname,
            short_desc: createAnnouncementDto.short_desc,
            text: createAnnouncementDto.text,
            link: createAnnouncementDto.link,
        })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
        for (const tag of createAnnouncementDto.tags) {
            await main_1.db.any('INSERT INTO tags (tagname) VALUES (${tagname}) ON CONFLICT DO NOTHING;', { tagname: tag });
            await main_1.db.any('INSERT INTO antags (anname, tagname) VALUES (${anname}, ${tagname}) ON ' +
                'CONFLICT DO NOTHING;', { anname: createAnnouncementDto.anname, tagname: tag });
        }
        return (await main_1.db.any('SELECT id FROM announcement WHERE anname=${anname};', {
            anname: createAnnouncementDto.anname,
        }))[0].id;
    }
    static async listc(idea) {
        return await main_1.db.any('SELECT anname, commenttext, c.username FROM announcement send JOIN ancomments ' +
            'c USING (anname) WHERE ideaname = ${ideaname};', { ideaname: idea });
    }
    static async listanc(anname) {
        return await main_1.db.any('SELECT anname, commenttext, c.username FROM announcement send JOIN ancomments ' +
            'c USING (anname) WHERE anname = ${anname};', { anname: anname });
    }
    static async listt(idea) {
        return await main_1.db.any('SELECT anname, tagname FROM announcement NATURAL JOIN antags ' +
            'WHERE ideaname = ${ideaname};', { ideaname: idea });
    }
    static async listant(anname) {
        return await main_1.db.any('SELECT anname, tagname FROM announcement NATURAL JOIN antags ' +
            'WHERE anname = ${anname};', { anname: anname });
    }
    static async list(idea) {
        return await main_1.db.any('SELECT username, anname, short_desc, status FROM announcement WHERE ideaname = ${ideaname};', { ideaname: idea });
    }
    static async getbyname(anname) {
        return (await main_1.db.any('SELECT * FROM announcement WHERE anname = ${anname};', {
            anname: anname,
        }))[0];
    }
    static async namebyid(id) {
        return (await main_1.db.any('SELECT anname FROM announcement WHERE id=${id};', {
            id: id,
        }))[0].anname;
    }
    static async createcomment(createCommentDto, author) {
        return await main_1.db
            .any('INSERT INTO ancomments (anname, commenttext, username) VALUES ' +
            '(${anname}, ${commenttext}, ${username});', {
            anname: createCommentDto.anname,
            commenttext: createCommentDto.text,
            username: author,
        })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
    }
    static async choose(chooseAnnouncementDto) {
        return await main_1.db.any("UPDATE announcement SET status = 'chosen' WHERE anname = ${anname};" +
            "UPDATE ideas SET status = 'await' WHERE ideaname = ${ideaname};", {
            anname: chooseAnnouncementDto.anname,
            ideaname: chooseAnnouncementDto.ideaname,
        });
    }
}
exports.Announcement = Announcement;
//# sourceMappingURL=announcement.entity.js.map