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
exports.listOfLeaves = exports.insertLeaves = void 0;
const leaves_controller_1 = require("../controllers/leaves.controller");
function insertLeaves(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new leaves_controller_1.LeaveController();
        controller.body = req === null || req === void 0 ? void 0 : req.body;
        const message = yield (controller === null || controller === void 0 ? void 0 : controller.insert());
        res.send(message).end();
    });
}
exports.insertLeaves = insertLeaves;
function listOfLeaves(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const controller = new leaves_controller_1.LeaveController();
        controller.aggregate = [];
        const message = yield (controller === null || controller === void 0 ? void 0 : controller.list());
        res.send(message).end();
    });
}
exports.listOfLeaves = listOfLeaves;
