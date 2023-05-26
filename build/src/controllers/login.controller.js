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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _LoginController_instances, _LoginController_payload, _LoginController_employeeList;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginController = void 0;
const employee_controller_1 = require("./employee.controller");
const hashing_1 = __importDefault(require("../services/hashing"));
const roles_controller_1 = require("./roles.controller");
const mongodb_1 = require("mongodb");
class LoginController {
    constructor(payload) {
        _LoginController_instances.add(this);
        _LoginController_payload.set(this, void 0);
        __classPrivateFieldSet(this, _LoginController_payload, payload, "f");
    }
    login() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const list = yield __classPrivateFieldGet(this, _LoginController_instances, "m", _LoginController_employeeList).call(this);
                if (list === null || list === void 0 ? void 0 : list.length) {
                    let { _id, manager_id, organisation_id, role_id, username, first_name, last_name } = list[0];
                    const roleController = new roles_controller_1.RolesController();
                    roleController.aggregate = [
                        { $match: { _id: new mongodb_1.ObjectId(role_id) } },
                        { $project: { identifier: 1 } },
                        { $project: { _id: 0, name: 0 } }
                    ];
                    const result = yield (roleController === null || roleController === void 0 ? void 0 : roleController.list());
                    const identifier = (result === null || result === void 0 ? void 0 : result.length) ? (_a = result[0]) === null || _a === void 0 ? void 0 : _a.identifier : null;
                    if (!identifier) {
                        return null;
                    }
                    const payload = { id: _id, managerId: manager_id, organisationId: organisation_id, roleId: role_id, roleIdentifier: identifier, userName: username, time: new Date().getTime() };
                    const token = hashing_1.default.encrypt(payload);
                    return { name: `${first_name} ${last_name}`, token: token };
                }
                return null;
            }
            catch (e) {
                throw new Error(e === null || e === void 0 ? void 0 : e.message);
            }
        });
    }
}
exports.LoginController = LoginController;
_LoginController_payload = new WeakMap(), _LoginController_instances = new WeakSet(), _LoginController_employeeList = function _LoginController_employeeList() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const controller = new employee_controller_1.EmployeeController();
            controller.aggregate = [
                { $match: { $and: [{ username: (_a = __classPrivateFieldGet(this, _LoginController_payload, "f")) === null || _a === void 0 ? void 0 : _a.user_name, password: (_b = __classPrivateFieldGet(this, _LoginController_payload, "f")) === null || _b === void 0 ? void 0 : _b.password }] } }
            ];
            const list = yield (controller === null || controller === void 0 ? void 0 : controller.list());
            return list;
        }
        catch (e) {
            return null;
        }
    });
};
