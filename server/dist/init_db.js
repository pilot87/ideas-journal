"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init_db = void 0;
const init_db = async (db) => {
    await db.none(`CREATE TABLE IF NOT EXISTS users (
};
exports.init_db = init_db;
//# sourceMappingURL=init_db.js.map