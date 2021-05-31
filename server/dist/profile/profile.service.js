"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const common_1 = require("@nestjs/common");
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const profile_entity_1 = require("./entities/profile.entity");
let ProfileService = class ProfileService {
    async chemail(changeEmailDto, username, session) {
        await profile_entity_1.Profile.chemail(changeEmailDto, username);
        return { message: 'Email changed' };
    }
    async chpasswd(changePasswordDto, username) {
        const hashedpassword = await bcrypt.hash(changePasswordDto.password, 12);
        await profile_entity_1.Profile.chpasswd(hashedpassword, username);
        return { message: 'Password changed' };
    }
};
ProfileService = __decorate([
    common_1.Injectable()
], ProfileService);
exports.ProfileService = ProfileService;
//# sourceMappingURL=profile.service.js.map