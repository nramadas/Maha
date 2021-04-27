export enum ErrorType {
  AlreadyTaken = 'ALREADY_TAKEN',
  DoesNotExist = 'DOES_NOT_EXIST',
  FailedGoogleLogin = 'FAILED_GOOGLE_LOGIN',
  MissingGoogleCredentials = 'MISSING_GOOGLE_CREDENTIALS',
  SomethingElse = 'SOMETHING_ELSE',
  Unauthorized = 'UNAUTHORIZED',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
}
