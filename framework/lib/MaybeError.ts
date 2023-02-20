import { ErrorType } from './ErrorType';
export interface MaybeError {
  status?: ErrorType;
  hasError?: boolean;
  errorDescription?: string;
}
