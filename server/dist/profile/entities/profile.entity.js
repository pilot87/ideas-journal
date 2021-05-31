"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Profile = void 0;
const main_1 = require("../../main");
const duplicate_filter_1 = require("../../duplicate.filter");
class Profile {
    static async chemail(changeEmailDto, username) {
        await main_1.db
            .any('UPDATE users SET email = ${email} WHERE username = ${username}', {
            email: changeEmailDto.email,
            username: username,
        })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
    }
    static async chpasswd(password, username) {
        await main_1.db
            .any('UPDATE users SET password = ${password} WHERE username = ${username}', {
            password: password,
            username: username,
        })
            .catch((e) => {
            throw new duplicate_filter_1.DuplicateException(e['detail']);
        });
    }
}
exports.Profile = Profile;
//# sourceMappingURL=profile.entity.js.map