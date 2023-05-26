"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganisationController = void 0;
const globals_1 = require("../services/globals");
const controller_1 = __importDefault(require("./controller"));
class OrganisationController extends controller_1.default {
    constructor() {
        super();
        this.collection = globals_1.tables === null || globals_1.tables === void 0 ? void 0 : globals_1.tables.organisation;
    }
}
exports.OrganisationController = OrganisationController;
