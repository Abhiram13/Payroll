"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employee_router_1 = __importDefault(require("./employee.router"));
const organisation_router_1 = __importDefault(require("./organisation.router"));
const roles_router_1 = __importDefault(require("./roles.router"));
const leaves_router_1 = __importDefault(require("./leaves.router"));
const checkins_router_1 = __importDefault(require("./checkins.router"));
const apiRouter = express_1.default.Router();
apiRouter.use("/employee", employee_router_1.default);
apiRouter.use("/organisation", organisation_router_1.default);
apiRouter.use("/roles", roles_router_1.default);
apiRouter.use("/checkin", checkins_router_1.default);
apiRouter.use("/leaves", leaves_router_1.default);
exports.default = apiRouter;
