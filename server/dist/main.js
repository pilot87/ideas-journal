"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const http = require('http');
const core_1 = require("@nestjs/core");
const config = require('config');
const pgp = require('pg-promise')();
const app_module_1 = require("./app.module");
const init_db_1 = require("./init_db");
const PORT = config.get('port') || 443;
exports.db = pgp(config.get('connection_string'));
async function bootstrap() {
    await init_db_1.init_db(exports.db);
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    await app.listen(PORT);
}
bootstrap();
//# sourceMappingURL=main.js.map