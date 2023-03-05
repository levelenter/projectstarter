"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorResult = void 0;
const ErrorType_1 = require("./ErrorType");
/**
 * Responseステータスを含むエラー
 */
class ErrorResult extends Error {
    status; // クライアントにメッセージを返したい場合はOKにした上でhasErrorをtrueにする
    hasError;
    description;
    errorExpandedData;
    static getSystemError(obj, cause) {
        return new ErrorResult("Something broken! このエラーは操作ミスではなくバグの可能性があります。" + `:${obj} ${cause}`);
    }
    constructor(message, status = ErrorType_1.ErrorType.OK, // OKとしてhasErrorを返す
    hasError = true, errorExpandedData = {}) {
        super(message);
        this.description = message;
        this.status = status;
        this.hasError = hasError;
        this.errorExpandedData = errorExpandedData;
    }
}
exports.ErrorResult = ErrorResult;
//# sourceMappingURL=ErrorResult.js.map