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
const index_1 = require("../../index");
const bson_1 = require("bson");
const login_types_1 = require("../types/login.types");
class Controller {
    constructor() {
        this.collection = "";
        this.body = {};
        this.aggregate = [];
    }
    insert() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = index_1.MONGO.client.db(process.env.DB).collection(this.collection);
            const document = collection.insertOne(this.body);
            const { acknowledged } = yield document;
            const status = acknowledged ? login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK : login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.NOT_MODIFIED;
            return status;
        });
    }
    ;
    update(filter = {}, set) {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = index_1.MONGO.client.db(process.env.DB).collection(this.collection);
            const document = collection.updateOne(filter, set);
            const { acknowledged } = yield document;
            const status = acknowledged ? login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.OK : login_types_1.StatusCodes === null || login_types_1.StatusCodes === void 0 ? void 0 : login_types_1.StatusCodes.NOT_MODIFIED;
            return status;
        });
    }
    ;
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const collection = index_1.MONGO.client.db(process.env.DB).collection(this.collection);
            const data = yield collection.aggregate(this.aggregate).toArray();
            return data;
        });
    }
    ;
    findById(id, includeFields = {}, excludeFields = {}) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const collection = index_1.MONGO.client.db(process.env.DB).collection(this.collection);
                const aggregate = [
                    { $match: { _id: new bson_1.ObjectId(id) } }
                ];
                ((_a = Object.keys(includeFields)) === null || _a === void 0 ? void 0 : _a.length) && aggregate.push({ $project: includeFields });
                ((_b = Object.keys(excludeFields)) === null || _b === void 0 ? void 0 : _b.length) && aggregate.push({ $project: excludeFields });
                const data = yield collection.aggregate(aggregate).toArray();
                return (data === null || data === void 0 ? void 0 : data.length) ? data[0] : null;
            }
            catch (e) {
                return null;
            }
        });
    }
    ;
}
exports.default = Controller;
