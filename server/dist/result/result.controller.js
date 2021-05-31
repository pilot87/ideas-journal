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
exports.ResultController = void 0;
const common_1 = require("@nestjs/common");
const result_service_1 = require("./result.service");
const create_result_dto_1 = require("./dto/create-result.dto");
const auth_guard_1 = require("../auth.guard");
const duplicate_filter_1 = require("../duplicate.filter");
const user_interceptor_1 = require("../user.interceptor");
const activity_interceptor_1 = require("../activity.interceptor");
const negative_filter_1 = require("../negative.filter");
let ResultController = class ResultController {
    constructor(resultService) {
        this.resultService = resultService;
    }
    async create(createResultDto, req) {
        return await this.resultService.create(createResultDto, req.headers.user);
    }
    async getbyname(id) {
        return await this.resultService.getbyID(id);
    }
};
__decorate([
    common_1.Post('create'),
    common_1.UseGuards(auth_guard_1.AuthGuard),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_result_dto_1.CreateResultDto, Object]),
    __metadata("design:returntype", Promise)
], ResultController.prototype, "create", null);
__decorate([
    common_1.Get('getbyid/:id'),
    __param(0, common_1.Param('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ResultController.prototype, "getbyname", null);
ResultController = __decorate([
    common_1.Controller('api/result'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    common_1.UseFilters(new duplicate_filter_1.DuplicateFilter()),
    common_1.UseFilters(new negative_filter_1.NegativeFilter()),
    common_1.UseInterceptors(user_interceptor_1.UserInterceptor),
    common_1.UseInterceptors(activity_interceptor_1.ActivityInterceptor),
    __metadata("design:paramtypes", [result_service_1.ResultService])
], ResultController);
exports.ResultController = ResultController;
//# sourceMappingURL=result.controller.js.map