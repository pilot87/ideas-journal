"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const cryptoRandomString = require('crypto-random-string');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('config');
const user_entity_1 = require("./entities/user.entity");
const session_entity_1 = require("./entities/session.entity");
const negative_filter_1 = require("../negative.filter");
let AuthService = class AuthService {
    async register(createAuthDto) {
        createAuthDto.password = await bcrypt.hash(createAuthDto.password, 12);
        await user_entity_1.User.add(createAuthDto);
        return { message: 'User registered' };
    }
    async login(loginDto) {
        const user = await user_entity_1.User.findOneByName(loginDto.username);
        if (!user) {
            throw new negative_filter_1.NegativeException({ message: 'User not found', token: '' });
        }
        const isMatch = await bcrypt.compare(loginDto.password, user.password);
        if (!isMatch) {
            throw new negative_filter_1.NegativeException({ message: 'Wrong password', token: '' });
        }
        const session = cryptoRandomString({ length: 20, type: 'base64' });
        await session_entity_1.Session.add(session, user.username);
        const token = jwt.sign({
            session: session,
            username: user.username,
        }, config.get('jwtSecret'));
        return {
            message: 'Logged in',
            token: token,
            username: user.username,
            email: user.email,
        };
    }
};
AuthService = __decorate([
    common_1.Injectable()
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map