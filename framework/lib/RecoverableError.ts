import { ErrorResult } from './ErrorResult';
import { ErrorType } from './ErrorType';

export class RecoverableError extends ErrorResult {
  constructor(message: string) {
    super(message, ErrorType.OK, true, {});
  }
}
