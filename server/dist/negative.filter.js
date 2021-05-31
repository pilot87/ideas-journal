"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NegativeFilter = exports.NegativeException = void 0;
const common_1 = require("@nestjs/common");
class NegativeException {
    constructor(body, code) {
        this.body = body;
        this.code = code ? code : 400;
    }
}
exports.NegativeException = NegativeException;
let NegativeFilter = class NegativeFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        exception.body.message =
            typeof exception.body.message === 'string'
                ? [exception.body.message]
                : exception.body.message;
        response.status(exception.code).json(exception.body);
    }
};
NegativeFilter = __decorate([
    common_1.Catch(NegativeException)
], NegativeFilter);
exports.NegativeFilter = NegativeFilter;
//# sourceMappingURL=negative.filter.js.map