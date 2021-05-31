"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const profile_service_1 = require("./profile.service");
const change_email_dto_1 = require("./dto/change-email.dto");
const auth_guard_1 = require("../auth.guard");
const duplicate_filter_1 = require("../duplicate.filter");
const negative_filter_1 = require("../negative.filter");
const user_interceptor_1 = require("../user.interceptor");
const activity_interceptor_1 = require("../activity.interceptor");
const change_passwd_dto_1 = require("./dto/change-passwd.dto");
let ProfileController = class ProfileController {
    constructor(profileService) {
        this.profileService = profileService;
    }
    async chemail(changeEmailDto, req) {
        return await this.profileService.chemail(changeEmailDto, req.headers.user, req.headers.session);
    }
    async chpasswd(changePasswordDto, req) {
        return await this.profileService.chpasswd(changePasswordDto, req.headers.user);
    }
};
__decorate([
    common_1.Post('chemail'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_email_dto_1.ChangeEmailDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "chemail", null);
__decorate([
    common_1.Post('chpasswd'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [change_passwd_dto_1.ChangePasswordDto, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "chpasswd", null);
ProfileController = __decorate([
    common_1.Controller('api/profile'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    common_1.UseFilters(new duplicate_filter_1.DuplicateFilter()),
    common_1.UseFilters(new negative_filter_1.NegativeFilter()),
    common_1.UseInterceptors(user_interceptor_1.UserInterceptor),
    common_1.UseInterceptors(activity_interceptor_1.ActivityInterceptor),
    __metadata("design:paramtypes", [profile_service_1.ProfileService])
], ProfileController);
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map