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
exports.authorization = exports.authentication = void 0;
const hashing_1 = __importDefault(require("./hashing"));
const login_types_1 = require("../types/login.types");
const employee_controller_1 = require("../controllers/employee.controller");
const login_service_1 = require("./login.service");
const logger_service_1 = __importDefault(require("./logger.service"));
function authentication(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = req === null || req === void 0 ? void 0 : req.headers['authorization'];
        try {
            if (token) {
                const decrypted = hashing_1.default === null || hashing_1.default === void 0 ? void 0 : hashing_1.default.decrypt(token);
                const currentTime = new Date().getTime();
                const durationDiff = currentTime - (decrypted === null || decrypted === void 0 ? void 0 : decrypted.time);
                const tenMinutes = 600000;
                if (durationDiff > tenMinutes) {
                    (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.UN_AUTHORISE, null, "Token expired");
                    return;
                }
                const empController = new employee_controller_1.EmployeeController();
                const employee = yield empController.findById((_a = decrypted === null || decrypted === void 0 ? void 0 : decrypted.id) === null || _a === void 0 ? void 0 : _a.toString());
                if (employee) {
                    res.locals.payload = decrypted;
                    next();
                    return;
                }
                (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.UN_AUTHORISE, null, "Un Authorise");
                return;
            }
            ;
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.UN_AUTHORISE, null, "Token is invalid/ not provided");
            return;
        }
        catch (e) {
            logger_service_1.default === null || logger_service_1.default === void 0 ? void 0 : logger_service_1.default.error(e === null || e === void 0 ? void 0 : e.message);
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.UN_AUTHORISE, null, e === null || e === void 0 ? void 0 : e.message, true);
            return;
        }
    });
}
exports.authentication = authentication;
function authorization(req, res, next, roles) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const payload = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.payload;
            if (!(roles === null || roles === void 0 ? void 0 : roles.includes(payload === null || payload === void 0 ? void 0 : payload.roleIdentifier))) {
                (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.FORBIDDEN, null, "Current user do not have access to this API", true);
                return;
            }
            next();
            return;
        }
        catch (e) {
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.UN_AUTHORISE, null, e === null || e === void 0 ? void 0 : e.message, true);
            return;
        }
    });
}
exports.authorization = authorization;
