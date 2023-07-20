import AuthErrorType from "./auth-error-type-model";

interface TranslatedAuthError {
  code?: string;
  message: string;
  type: AuthErrorType;
}

export default TranslatedAuthError;
