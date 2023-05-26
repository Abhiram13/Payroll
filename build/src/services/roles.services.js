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
Object.defineProperty(exports, "__esModule", { value: true });
exports.listOfRoles = exports.updateRoles = exports.insertRoles = void 0;
const roles_controller_1 = require("../controllers/roles.controller");
const schemas_1 = require("../types/schemas");
const login_types_1 = require("../types/login.types");
const login_service_1 = require("./login.service");
function insertRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new roles_controller_1.RolesController();
        const payload = req === null || req === void 0 ? void 0 : req.body;
        if (!Object.values(schemas_1.RoleIdentifier).includes(payload === null || payload === void 0 ? void 0 : payload.identifier)) {
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.BAD_REQUEST, null, "Invalid Role identifier");
            return;
        }
        controller.body = req === null || req === void 0 ? void 0 : req.body;
        // const status: StatusCodes = await controller?.insert();
        // const message: string = status === StatusCodes?.OK ? "Document inserted successfully" : "Inserting document failed";
        (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK, null, "NO NEW ROLES WILL BE ADDED");
    });
}
exports.insertRoles = insertRoles;
function updateRoles(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new roles_controller_1.RolesController();
        const roleId = (_a = req === null || req === void 0 ? void 0 : req.params) === null || _a === void 0 ? void 0 : _a.id;
        const payload = req === null || req === void 0 ? void 0 : req.body;
        if (!roleId) {
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.BAD_REQUEST, null, "Invalid Role id");
            return;
        }
        if (!Object.values(schemas_1.RoleIdentifier).includes(payload === null || payload === void 0 ? void 0 : payload.identifier)) {
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.BAD_REQUEST, null, "Invalid Role identifier");
            return;
        }
        // const status: StatusCodes = await controller?.update({_id: new ObjectId(roleId)}, {$set: payload});
        // const message: string = status === StatusCodes?.OK ? "Document updated successfully" : "Updating document failed";
        (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK, null, "ROLES ARE ALREADY UP-TO-DATE");
    });
}
exports.updateRoles = updateRoles;
function listOfRoles(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new roles_controller_1.RolesController();
        controller.aggregate = [];
        const result = yield (controller === null || controller === void 0 ? void 0 : controller.list());
        const status = (result === null || result === void 0 ? void 0 : result.length) ? login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK : login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.NO_DATA;
        (0, login_service_1.ApiReponse)(res, status, result, undefined);
    });
}
exports.listOfRoles = listOfRoles;
