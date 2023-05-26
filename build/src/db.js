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
exports.Mongo = void 0;
const mongodb_1 = require("mongodb");
require('dotenv').config();
class Mongo {
    static Connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Mongo.client.connect();
                Mongo.client.db(process.env.DB);
            }
            catch (e) {
                console.error(e === null || e === void 0 ? void 0 : e.message);
            }
        });
    }
}
exports.Mongo = Mongo;
Mongo.URI = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOST}/?retryWrites=true&w=majority`;
Mongo.client = new mongodb_1.MongoClient(Mongo.URI);
