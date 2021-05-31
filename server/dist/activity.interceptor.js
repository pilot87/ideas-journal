"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityInterceptor = void 0;
const common_1 = require("@nestjs/common");
const jwt = require('jsonwebtoken');
const config = require('config');
const session_entity_1 = require("./auth/entities/session.entity");
let ActivityInterceptor = class ActivityInterceptor {
    intercept(context, next) {
        try {
            const token = context
                .switchToHttp()
                .getRequest()
                .headers.authorization.split(' ')[1];
            const { session } = jwt.verify(token, config.get('jwtSecret'));
            session_entity_1.Session.active(session);
        }
        finally {
            return next.handle();
        }
    }
};
ActivityInterceptor = __decorate([
    common_1.Injectable()
], ActivityInterceptor);
exports.ActivityInterceptor = ActivityInterceptor;
//# sourceMappingURL=activity.interceptor.js.map