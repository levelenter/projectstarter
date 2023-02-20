import { MaybeError } from "./MaybeError";
import { MessageDialog } from "./MessageDialog";

export class ErrorHandler {
  static atResponseError(error: MaybeError) {
    console.error(error.status, error.errorDescription);
    MessageDialog.alert(error.errorDescription);
  }
}
