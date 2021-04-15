export enum ErrorType {
  FailedGoogleLogin = 'FAILED_GOOGLE_LOGIN',
  IncorrectUsernamePassword = 'INCORRECT_USERNAME_PASSWORD',
  MissingGoogleCredentials = 'MISSING_GOOGLE_CREDENTIALS',
  PasswordsDontMatch = 'PASSWORDS_DONT_MATCH',
  Unauthorized = 'UNAUTHORIZED',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
  SomethingElse = 'SOMETHING_ELSE',
}
