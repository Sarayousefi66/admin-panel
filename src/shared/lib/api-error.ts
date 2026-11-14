import axios from "axios";

export type ApiErrorTranslationKey =
  | "generic"
  | "network"
  | "requestFailed"
  | "http.badRequest"
  | "http.unauthorized"
  | "http.forbidden"
  | "http.notFound"
  | "http.conflict"
  | "http.validation"
  | "http.rateLimit"
  | "http.serverError";

export type ErrorTranslator = (
  key: ApiErrorTranslationKey,
) => string;

function getStatusTranslationKey(
  status: number,
): ApiErrorTranslationKey {
  switch (status) {
    case 400:
      return "http.badRequest";
    case 401:
      return "http.unauthorized";
    case 403:
      return "http.forbidden";
    case 404:
      return "http.notFound";
    case 409:
      return "http.conflict";
    case 422:
      return "http.validation";
    case 429:
      return "http.rateLimit";
    default:
      return status >= 500
        ? "http.serverError"
        : "requestFailed";
  }
}

export function getErrorMessage(
  error: unknown,
  translate?: ErrorTranslator,
): string {
  if (axios.isAxiosError(error)) {
    if (translate) {
      if (!error.response) {
        return translate("network");
      }

      return translate(
        getStatusTranslationKey(error.response.status),
      );
    }

    return (
      error.response?.data?.message ??
      error.message
    );
  }

  if (error instanceof Error) {
    return translate
      ? translate("generic")
      : error.message;
  }

  return translate
    ? translate("generic")
    : "Something went wrong";
}