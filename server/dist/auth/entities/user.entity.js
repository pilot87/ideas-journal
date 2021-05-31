"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const duplicate_filter_1 = require("../../duplicate.filter");
const main_1 = require("../../main");
class User {
    static async add(createUserDto) {
        if (createUserDto.test) {
            return await main_1.db
                .any('INSERT INTO users (username, password, email, test) VALUES ' +
                '(${username}, ${password}, ${email}, ${test});', {
                username: createUserDto.username,
                password: createUserDto.password,
                email: createUserDto.email,
                test: createUserDto.test,
            })
                .catch((e) => {
                throw new duplicate_filter_1.DuplicateException(e['detail']);
            });
        }
        else {
            return await main_1.db
                .any('INSERT INTO users (username, password, email) VALUES ' +
                '(${username}, ${password}, ${email});', {
                username: createUserDto.username,
                password: createUserDto.password,
                email: createUserDto.email,
            })
                .catch((e) => {
                throw new duplicate_filter_1.DuplicateException(e['detail']);
            });
        }
    }
    static async findOneByName(name) {
        return (await main_1.db.any('SELECT * FROM users WHERE username = ${name}', {
            name: name,
        }))[0];
    }
}
exports.User = User;
//# sourceMappingURL=user.entity.js.map