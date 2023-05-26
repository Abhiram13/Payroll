"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = exports.MONGO = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./src/db");
const routes_1 = __importDefault(require("./src/routes/routes"));
const logger_service_1 = __importDefault(require("./src/services/logger.service"));
require('dotenv').config();
exports.MONGO = db_1.Mongo;
const app = (0, express_1.default)();
exports.app = app;
const cors = require('cors');
const bodyparser = require('body-parser');
const port = process.env.PORT || 3000;
const seconds = 1000;
let server;
if (((_a = process === null || process === void 0 ? void 0 : process.env) === null || _a === void 0 ? void 0 : _a.NODE_ENV) !== 'test') {
    console.log('HITTED');
    server = app.listen(port, StartServer);
    // if API response not sent during this time, server will throw timeout error
    server.timeout = 20 * seconds;
}
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use("/", routes_1.default);
function StartServer() {
    db_1.Mongo.Connect();
    logger_service_1.default.info(`TypeScript started on port ${port}!`);
}
// console.log('HITTED');
// server = app.listen(port, StartServer);
// // if API response not sent during this time, server will throw timeout error
// server.timeout = 20 * seconds;
