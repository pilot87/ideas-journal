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
exports.AnnouncementController = void 0;
const common_1 = require("@nestjs/common");
const announcement_service_1 = require("./announcement.service");
const create_announcement_dto_1 = require("./dto/create-announcement.dto");
const auth_guard_1 = require("../auth.guard");
const duplicate_filter_1 = require("../duplicate.filter");
const user_interceptor_1 = require("../user.interceptor");
const activity_interceptor_1 = require("../activity.interceptor");
const choose_announcement_dto_1 = require("./dto/choose-announcement.dto");
const create_comment_dto_1 = require("./dto/create-comment.dto");
const negative_filter_1 = require("../negative.filter");
let AnnouncementController = class AnnouncementController {
    constructor(announcementService) {
        this.announcementService = announcementService;
    }
    async create(createAnnouncementDto, req) {
        return await this.announcementService.create(createAnnouncementDto, req.headers.user);
    }
    async list(idea) {
        return await this.announcementService.list(idea);
    }
    async createcomment(createCommentDto, req) {
        return await this.announcementService.createcomment(createCommentDto, req.headers.user);
    }
    async getbyID(id) {
        return await this.announcementService.getbyID(id);
    }
    async choose(chooseAnnouncementDto, req) {
        return await this.announcementService.choose(chooseAnnouncementDto, req.headers.user);
    }
};
__decorate([
    common_1.Post('create'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_announcement_dto_1.CreateAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "create", null);
__decorate([
    common_1.Get('list/:idea'),
    __param(0, common_1.Param('idea')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "list", null);
__decorate([
    common_1.Post('createcomment'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_comment_dto_1.CreateCommentDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "createcomment", null);
__decorate([
    common_1.Get('getbyid/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "getbyID", null);
__decorate([
    common_1.Post('choose'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()),
    __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [choose_announcement_dto_1.ChooseAnnouncementDto, Object]),
    __metadata("design:returntype", Promise)
], AnnouncementController.prototype, "choose", null);
AnnouncementController = __decorate([
    common_1.Controller('api/announcement'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    common_1.UseFilters(new duplicate_filter_1.DuplicateFilter()),
    common_1.UseFilters(new negative_filter_1.NegativeFilter()),
    common_1.UseInterceptors(user_interceptor_1.UserInterceptor),
    common_1.UseInterceptors(activity_interceptor_1.ActivityInterceptor),
    __metadata("design:paramtypes", [announcement_service_1.AnnouncementService])
], AnnouncementController);
exports.AnnouncementController = AnnouncementController;
//# sourceMappingURL=announcement.controller.js.map