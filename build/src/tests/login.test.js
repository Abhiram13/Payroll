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
// to run a specific file, use command `npm test -- src/tests/<filename>.<ext>
// to run a specific test case, use command `npm test -- -t '<test case name mentioned in describe callback || test case name mentioned in test callback>, 
// for example `npm test -- -t 'POST /login test'` || `npm test -- -t 'should get response with 200 status'`
(0, globals_1.describe)("POST /login", () => {
    (0, globals_1.test)("should get response with 200 status", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const res = yield (0, supertest_1.default)(__1.app).post("/login").send({
            user_name: "abhi",
            password: "123"
        });
        expect((_a = res === null || res === void 0 ? void 0 : res.body) === null || _a === void 0 ? void 0 : _a.status).toBe(200);
    }));
    (0, globals_1.test)("should get response with token", () => __awaiter(void 0, void 0, void 0, function* () {
        var _b, _c;
        const res = yield (0, supertest_1.default)(__1.app).post("/login").send({
            user_name: "abhi",
            password: "123"
        });
        expect((_c = (_b = res === null || res === void 0 ? void 0 : res.body) === null || _b === void 0 ? void 0 : _b.result) === null || _c === void 0 ? void 0 : _c.token).not.toEqual("");
    }));
});
(0, globals_1.describe)("POST /login test", () => {
    (0, globals_1.test)("should get 400 if empty", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const res = yield (0, supertest_1.default)(__1.app).post("/login").send();
        expect((_a = res === null || res === void 0 ? void 0 : res.body) === null || _a === void 0 ? void 0 : _a.status).toBe(400);
    }));
});
afterAll(() => {
    // server?.close();
    __1.MONGO.client.close();
});
