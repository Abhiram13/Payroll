"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrgService = __importStar(require("../services/organisation.service"));
const middleware_service_1 = require("../services/middleware.service");
const schemas_1 = require("../types/schemas");
const orgRouter = express_1.default.Router();
orgRouter.post("/add", (req, res, next) => (0, middleware_service_1.authorization)(req, res, next, [schemas_1.RoleIdentifier === null || schemas_1.RoleIdentifier === void 0 ? void 0 : schemas_1.RoleIdentifier.SuperAdmin]), OrgService.insertOrganisation);
orgRouter.get("/employees", OrgService.listOfOrganisations);
orgRouter.get("/fetch", OrgService.fetchOrganisation);
exports.default = orgRouter;
