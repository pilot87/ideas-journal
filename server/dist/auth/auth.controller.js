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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const login_dto_1 = require("./dto/login.dto");
const duplicate_filter_1 = require("../duplicate.filter");
const user_interceptor_1 = require("../user.interceptor");
const activity_interceptor_1 = require("../activity.interceptor");
const negative_filter_1 = require("../negative.filter");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async register(createAuthDto) {
        return await this.authService.register(createAuthDto);
    }
    async login(loginDto) {
        return await this.authService.login(loginDto);
    }
};
__decorate([
    common_1.Post('register'),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    common_1.Post('login'),
    common_1.UseInterceptors(activity_interceptor_1.ActivityInterceptor),
    __param(0, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_dto_1.LoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
AuthController = __decorate([
    common_1.Controller('api/auth'),
    common_1.UsePipes(new common_1.ValidationPipe()),
    common_1.UseInterceptors(user_interceptor_1.UserInterceptor),
    common_1.UseFilters(new duplicate_filter_1.DuplicateFilter()),
    common_1.UseFilters(new negative_filter_1.NegativeFilter()),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map