"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorType = void 0;
var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["SEVER_ERROR"] = 500] = "SEVER_ERROR";
    ErrorType[ErrorType["CLIENT_ERROR"] = 400] = "CLIENT_ERROR";
    ErrorType[ErrorType["UNAUTHORIZED_ERROR"] = 401] = "UNAUTHORIZED_ERROR";
    ErrorType[ErrorType["NO_CONTENT"] = 203] = "NO_CONTENT";
    ErrorType[ErrorType["OK"] = 200] = "OK";
})(ErrorType = exports.ErrorType || (exports.ErrorType = {}));
//# sourceMappingURL=ErrorType.js.map