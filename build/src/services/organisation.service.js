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
exports.fetchOrganisation = exports.listOfOrganisations = exports.insertOrganisation = void 0;
const organisation_controller_1 = require("../controllers/organisation.controller");
const schemas_1 = require("../types/schemas");
const login_types_1 = require("../types/login.types");
const login_service_1 = require("./login.service");
const globals_1 = require("./globals");
const employee_controller_1 = require("../controllers/employee.controller");
const roles_controller_1 = require("../controllers/roles.controller");
function fetchEmployee(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const empController = new employee_controller_1.EmployeeController();
            const result = yield (empController === null || empController === void 0 ? void 0 : empController.findById(id, { role_id: 1 }, { _id: 0 }));
            return result;
        }
        catch (e) {
            console.log('#1 ', e === null || e === void 0 ? void 0 : e.message);
            return null;
        }
    });
}
function fetchRoleIdentifier(id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const roleController = new roles_controller_1.RolesController();
            const result = yield roleController.findById(id, { identifier: 1 }, { _id: 0 });
            return result;
        }
        catch (e) {
            console.log('#2 ', e === null || e === void 0 ? void 0 : e.message);
            return null;
        }
    });
}
function insertOrganisation(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new organisation_controller_1.OrganisationController();
        const payload = req === null || req === void 0 ? void 0 : req.body;
        const employee = yield fetchEmployee(payload === null || payload === void 0 ? void 0 : payload.admin_id);
        const role = yield fetchRoleIdentifier((employee === null || employee === void 0 ? void 0 : employee.role_id) || "");
        if (employee && (role === null || role === void 0 ? void 0 : role.identifier) !== (schemas_1.RoleIdentifier === null || schemas_1.RoleIdentifier === void 0 ? void 0 : schemas_1.RoleIdentifier.OrganisationAdmin)) {
            (0, login_service_1.ApiReponse)(res, login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.BAD_REQUEST, null, "Invalid Admin id");
            return;
        }
        controller.body = payload;
        const status = yield (controller === null || controller === void 0 ? void 0 : controller.insert());
        const message = status === (login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK) ? "Organisation inserted successfully" : "Insering Organisation failed";
        (0, login_service_1.ApiReponse)(res, status, null, message);
    });
}
exports.insertOrganisation = insertOrganisation;
function listOfOrganisations(req, res) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new employee_controller_1.EmployeeController();
        const orgId = (_b = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.payload) === null || _b === void 0 ? void 0 : _b.organisationId;
        controller.aggregate = [
            { $match: { "organisation_id": orgId } },
            {
                $addFields: { organisation_id: { $toObjectId: "$organisation_id" } }
            },
            {
                $lookup: {
                    from: globals_1.tables === null || globals_1.tables === void 0 ? void 0 : globals_1.tables.organisation,
                    localField: "organisation_id",
                    foreignField: "_id",
                    as: "Organisation"
                }
            },
            { $project: { username: 0, password: 0 } },
            { $project: {
                    organisation_name: {
                        $reduce: {
                            input: "$Organisation.name",
                            initialValue: "",
                            in: { $concat: ["$$value", "$$this"] }
                        }
                    },
                    first_name: 1, last_name: 1, phone: 1, email: 1, date_of_birth: 1
                } }
        ];
        const data = yield (controller === null || controller === void 0 ? void 0 : controller.list());
        const status = (data === null || data === void 0 ? void 0 : data.length) ? login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK : login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.NO_DATA;
        const message = (data === null || data === void 0 ? void 0 : data.length) ? undefined : "No Employee found at given Organisation";
        (0, login_service_1.ApiReponse)(res, status, data, message);
    });
}
exports.listOfOrganisations = listOfOrganisations;
function fetchOrganisation(req, res) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const token = (_a = res === null || res === void 0 ? void 0 : res.locals) === null || _a === void 0 ? void 0 : _a.payload;
        const controller = new organisation_controller_1.OrganisationController();
        const organisation = yield controller.findById((token === null || token === void 0 ? void 0 : token.organisationId) || "");
        const status = organisation ? login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK : login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.NO_DATA;
        const message = organisation ? undefined : 'No Organisation found';
        (0, login_service_1.ApiReponse)(res, status, organisation, message);
    });
}
exports.fetchOrganisation = fetchOrganisation;
