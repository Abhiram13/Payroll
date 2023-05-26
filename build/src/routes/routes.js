"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_service_1 = require("../services/login.service");
const middleware_service_1 = require("../services/middleware.service");
const apis_router_1 = __importDefault(require("./apis.router"));
const router = express_1.default.Router();
router.get("/", (req, res) => res.send('Hello World'));
router.post("/login", login_service_1.login);
router.use("/api", middleware_service_1.authentication, apis_router_1.default);
exports.default = router;
