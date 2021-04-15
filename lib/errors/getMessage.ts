import { ErrorType } from '@/lib/errors/type';

export function getMessage(type: ErrorType): string {
  switch (type) {
    case ErrorType.FailedGoogleLogin:
      return 'Could not sign into Google';
    case ErrorType.IncorrectUsernamePassword:
      return 'Incorrect username and/or password';
    case ErrorType.MissingGoogleCredentials:
      return 'Missing Google credentials';
    case ErrorType.PasswordsDontMatch:
      return 'Passwords do not match';
    case ErrorType.Unauthorized:
      return 'You are unauthorized to perform that action';
    case ErrorType.UserAlreadyExists:
      return 'That user already exists';
    case ErrorType.SomethingElse:
      return 'Something went wrong';
  }
}
