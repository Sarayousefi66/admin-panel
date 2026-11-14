import {
  getErrorMessage,
  type ErrorTranslator,
} from "./api-error";

import { appToast } from "./toast";

export function handleMutationError(
  error: unknown,
  translate: ErrorTranslator,
) {
  appToast.error(getErrorMessage(error, translate));
}