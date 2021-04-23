import { ErrorType } from '@/lib/errors/type';
import { i18n } from '@/lib/translate';

export function getMessage(type: ErrorType) {
  switch (type) {
    case ErrorType.FailedGoogleLogin:
      return i18n.translate`Could not sign into Google`;
    case ErrorType.IncorrectUsernamePassword:
      return i18n.translate`Incorrect username and/or password`;
    case ErrorType.MissingGoogleCredentials:
      return i18n.translate`Missing Google credentials`;
    case ErrorType.PasswordsDontMatch:
      return i18n.translate`Passwords do not match`;
    case ErrorType.Unauthorized:
      return i18n.translate`You are unauthorized to perform that action`;
    case ErrorType.UserAlreadyExists:
      return i18n.translate`That user already exists`;
    case ErrorType.SomethingElse:
      return i18n.translate`Something went wrong`;
  }
}
