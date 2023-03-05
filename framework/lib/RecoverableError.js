"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RecoverableError = void 0;
const ErrorResult_1 = require("./ErrorResult");
const ErrorType_1 = require("./ErrorType");
class RecoverableError extends ErrorResult_1.ErrorResult {
    constructor(message) {
        super(message, ErrorType_1.ErrorType.OK, true, {});
    }
}
exports.RecoverableError = RecoverableError;
//# sourceMappingURL=RecoverableError.js.map