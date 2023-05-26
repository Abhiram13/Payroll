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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _a, _Hashing_BYTES;
Object.defineProperty(exports, "__esModule", { value: true });
const Hash = __importStar(require("crypto"));
class Hashing {
    static encrypt(payload) {
        const stringify = JSON.stringify(payload);
        const algorithm = 'aes-256-gcm';
        const message = stringify;
        const iv = __classPrivateFieldGet(this, _a, "f", _Hashing_BYTES);
        const sKey = process.env.SECRET_KEY;
        const cipher = Hash.createCipheriv(algorithm, sKey, iv);
        let encryptedData = cipher.update(message, 'utf-8', 'hex');
        encryptedData += cipher.final('hex');
        const authTag = cipher.getAuthTag().toString("hex");
        return `${authTag}:${encryptedData}:${__classPrivateFieldGet(this, _a, "f", _Hashing_BYTES).toString('base64')}`;
    }
    static decrypt(payload) {
        const [authTag, encryptedData, bytes] = payload === null || payload === void 0 ? void 0 : payload.split(':');
        const decipher = Hash.createDecipheriv('aes-256-gcm', process.env.SECRET_KEY, Buffer.from(bytes, 'base64'));
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));
        let decData = decipher.update(encryptedData, 'hex', 'utf-8');
        decData += decipher.final('utf-8');
        const data = JSON.parse(decData);
        return data;
    }
}
exports.default = Hashing;
_a = Hashing;
_Hashing_BYTES = { value: Hash.randomBytes(12) };
