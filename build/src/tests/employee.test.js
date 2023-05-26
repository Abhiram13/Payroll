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
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const __1 = require("../..");
(0, globals_1.describe)("Employee router", () => {
    function fetchToken() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield (0, supertest_1.default)(__1.app).post("/login").send({
                user_name: "abhi",
                password: "123"
            });
            return ((_b = (_a = res === null || res === void 0 ? void 0 : res.body) === null || _a === void 0 ? void 0 : _a.result) === null || _b === void 0 ? void 0 : _b.token) || null;
        });
    }
    let token = fetchToken();
    (0, globals_1.test)("fetch employee", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g;
        const res = yield (0, supertest_1.default)(__1.app).get("/api/organisation/fetch").set("authorization", `${yield token}`);
        (_a = expect(res === null || res === void 0 ? void 0 : res.status)) === null || _a === void 0 ? void 0 : _a.toBe(200);
        (_c = expect((_b = res === null || res === void 0 ? void 0 : res.body) === null || _b === void 0 ? void 0 : _b.status)) === null || _c === void 0 ? void 0 : _c.toBe(200);
        (_g = (_f = expect((_e = (_d = res === null || res === void 0 ? void 0 : res.body) === null || _d === void 0 ? void 0 : _d.result) === null || _e === void 0 ? void 0 : _e._id)) === null || _f === void 0 ? void 0 : _f.not) === null || _g === void 0 ? void 0 : _g.toBe("");
    }));
});
afterAll(() => {
    // server?.close();
    __1.MONGO.client.close();
});
