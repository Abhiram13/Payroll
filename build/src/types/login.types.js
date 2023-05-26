"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusCodes = void 0;
var StatusCodes;
(function (StatusCodes) {
    StatusCodes[StatusCodes["OK"] = 200] = "OK";
    StatusCodes[StatusCodes["NO_DATA"] = 204] = "NO_DATA";
    StatusCodes[StatusCodes["NOT_MODIFIED"] = 304] = "NOT_MODIFIED";
    StatusCodes[StatusCodes["UN_AUTHORISE"] = 401] = "UN_AUTHORISE";
    StatusCodes[StatusCodes["FORBIDDEN"] = 403] = "FORBIDDEN";
    StatusCodes[StatusCodes["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    StatusCodes[StatusCodes["SERVER_ERROR"] = 500] = "SERVER_ERROR";
})(StatusCodes = exports.StatusCodes || (exports.StatusCodes = {}));
