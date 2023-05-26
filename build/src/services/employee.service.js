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
exports.fetchEmployee = exports.insertEmployee = void 0;
const employee_controller_1 = require("../controllers/employee.controller");
const organisation_controller_1 = require("../controllers/organisation.controller");
const login_service_1 = require("./login.service");
const login_types_1 = require("../types/login.types");
const logger_service_1 = __importDefault(require("./logger.service"));
const roles_controller_1 = require("../controllers/roles.controller");
/**
 * Manager id - Find if manager is reporting manager or not, if not throw error
 * Organisation id - Find if the organisation exists and find the given manager belongs to that organisation and find if that organisation contains other reporting manager
 * Role id - Find if role is not of Super admin
 */
function insertEmployee(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const body = req === null || req === void 0 ? void 0 : req.body;
        const controller = new employee_controller_1.EmployeeController();
        const orgControler = new organisation_controller_1.OrganisationController();
        const org = yield (orgControler === null || orgControler === void 0 ? void 0 : orgControler.findById(body === null || body === void 0 ? void 0 : body.organisation_id, { _id: 1 }));
        const manager = yield (controller === null || controller === void 0 ? void 0 : controller.findById(body === null || body === void 0 ? void 0 : body.manager_id));
        const roleController = new roles_controller_1.RolesController();
        const identifier = yield roleController.findById(body === null || body === void 0 ? void 0 : body.role_id, { identifier: 1 }, { name: 0, _id: 0 });
        logger_service_1.default.log(manager);
        if (((_a = org === null || org === void 0 ? void 0 : org._id) === null || _a === void 0 ? void 0 : _a.toString()) !== (body === null || body === void 0 ? void 0 : body.organisation_id)) {
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.BAD_REQUEST, null, "Organisation does not exist with given value");
            return;
        }
        controller.body = body;
        const message = yield (controller === null || controller === void 0 ? void 0 : controller.insert());
        res.send(message).end();
    });
}
exports.insertEmployee = insertEmployee;
function fetchEmployee(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const id = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        const controller = new employee_controller_1.EmployeeController();
        const result = yield (controller === null || controller === void 0 ? void 0 : controller.findById(id, { first_name: 1, last_name: 1 }));
        res.send(result).end();
    });
}
exports.fetchEmployee = fetchEmployee;
