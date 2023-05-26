"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiReponse = exports.login = void 0;
const login_controller_1 = require("../controllers/login.controller");
const login_types_1 = require("../types/login.types");
const logger_service_1 = __importDefault(require("./logger.service"));
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const controller = new login_controller_1.LoginController(req === null || req === void 0 ? void 0 : req.body);
            const data = yield (controller === null || controller === void 0 ? void 0 : controller.login());
            const status = (data === null || data === void 0 ? void 0 : data.token) ? login_types_1.StatusCodes.OK : login_types_1.StatusCodes.BAD_REQUEST;
            const message = data ? undefined : "Invalid Credentials";
            ApiReponse(res, status, data, message);
        }
        catch (e) {
            logger_service_1.default === null || logger_service_1.default === void 0 ? void 0 : logger_service_1.default.error(e === null || e === void 0 ? void 0 : e.message);
            ApiReponse(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.UN_AUTHORISE, null, "Invalid Credentials", true);
        }
    });
}
exports.login = login;
function ApiReponse(res, status, result, message, error = false) {
    var _a;
    const response = { status, error };
    if (result)
        response.result = result;
    if (message)
        response.message = message;
    (_a = res === null || res === void 0 ? void 0 : res.status(200).send(response)) === null || _a === void 0 ? void 0 : _a.end();
}
exports.ApiReponse = ApiReponse;
