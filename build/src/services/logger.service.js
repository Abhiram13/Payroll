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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _Logger_red, _Logger_blue, _Logger_yellow, _Logger_white;
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeFile = void 0;
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const dir = path_1.default === null || path_1.default === void 0 ? void 0 : path_1.default.join(__dirname, '..', "..");
const folderWithPath = `${dir}/.logs`;
const fileName = fileNameWithDate();
function writeFile() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield (fs === null || fs === void 0 ? void 0 : fs.mkdir(folderWithPath, { recursive: true }));
            Logger.info('Log Folder was created');
        }
        catch (e) {
            Logger.error('error at creating Log folder: ', e === null || e === void 0 ? void 0 : e.message);
        }
    });
}
exports.writeFile = writeFile;
function appendFile(content, type = 'LOG') {
    var _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const TIMESTAMP = (_b = new Date().toLocaleTimeString()) === null || _b === void 0 ? void 0 : _b.substring(0, 8);
            const logInformation = `${TIMESTAMP} [${type}] - ${content}\n`;
            fs.appendFile(`${folderWithPath}/${fileName}.log`, logInformation);
        }
        catch (e) {
            Logger.error(`Error at appending file at ${folderWithPath}/${fileName}.log: `, e);
        }
    });
}
function fileNameWithDate() {
    let date = new Date().toLocaleString();
    let [d, t] = date === null || date === void 0 ? void 0 : date.split(", ");
    let [dt, m, y] = d === null || d === void 0 ? void 0 : d.split("/");
    let [h, mi, s] = t === null || t === void 0 ? void 0 : t.split(":");
    return `${dt}_${m}_${y}`;
}
class Logger {
    static info(...arg) {
        console.log(`[${__classPrivateFieldGet(Logger, _a, "f", _Logger_blue)}]`, 'INFO', ...arg);
        // appendFile(arg, 'INFO');
    }
    static error(...arg) {
        console.log(`[${__classPrivateFieldGet(Logger, _a, "f", _Logger_red)}]`, 'ERROR', ...arg);
        // appendFile(arg, 'ERROR');
    }
    static warn(...arg) {
        console.log(`[${__classPrivateFieldGet(Logger, _a, "f", _Logger_yellow)}]`, 'WARN', ...arg);
        // appendFile(arg, 'WARN');
    }
    static log(...arg) {
        console.log(`[${__classPrivateFieldGet(Logger, _a, "f", _Logger_white)}]`, 'LOG', ...arg);
        // appendFile(arg, 'LOG');
    }
}
exports.default = Logger;
_a = Logger;
_Logger_red = { value: '\x1b[31m%s\x1b[0m' };
_Logger_blue = { value: '\x1b[36m%s\x1b[0m' };
_Logger_yellow = { value: '\x1b[33m%s\x1b[0m' };
_Logger_white = { value: '\x1b[37m%s\x1b[0m' };
