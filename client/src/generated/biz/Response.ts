import { MaybeError } from "./MaybeError";
import { ErrorType } from "./ErrorType";

export class Response<T> implements MaybeError {
  status: ErrorType = ErrorType.OK;
  public hasError = false;
  public errorDescription = "";
  public errorExpandedData: any = null;

  toPlainObject(): any {
    return JSON.parse(JSON.stringify(this));
  }

  constructor(data: T) {
    this.data = data;
  }
  public data: T;
}
