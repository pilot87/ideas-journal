"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const main_1 = require("../../main");
const duplicate_filter_1 = require("../../duplicate.filter");
class Session {
    static async add(sessionID, username) {
        return await main_1.db
            .any('INSERT INTO sessions (sessionID, username) VALUES (${sessionID}, ${username});', { sessionID: sessionID, username: username })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
    }
    static async duration(sessionID) {
        if ((await main_1.db.any('SELECT last_activity FROM sessions WHERE sessionID = ${sessionID}', { sessionID: sessionID }))[0]) {
            return (await main_1.db.one("SELECT (CURRENT_TIMESTAMP - (SELECT last_activity FROM sessions WHERE sessionID = ${sessionID})) < INTERVAL '3 hours';", { sessionID: sessionID }))['?column?'];
        }
        else {
            return false;
        }
    }
    static async active(sessionID) {
        await main_1.db.none('UPDATE sessions SET last_activity = CURRENT_TIMESTAMP WHERE sessionID = ${sessionID};', { sessionID: sessionID });
    }
}
exports.Session = Session;
//# sourceMappingURL=session.entity.js.map