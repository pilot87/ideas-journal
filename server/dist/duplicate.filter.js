"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DuplicateFilter = exports.DuplicateException = void 0;
const common_1 = require("@nestjs/common");
class DuplicateException {
    constructor(msg) {
        this.detail = msg;
    }
}
exports.DuplicateException = DuplicateException;
let DuplicateFilter = class DuplicateFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        response.status(400).json({
            message: [exception.detail],
            error: 'Bad Request',
        });
    }
};
DuplicateFilter = __decorate([
    common_1.Catch(DuplicateException)
], DuplicateFilter);
exports.DuplicateFilter = DuplicateFilter;
//# sourceMappingURL=duplicate.filter.js.map