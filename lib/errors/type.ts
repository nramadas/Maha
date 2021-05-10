export enum ErrorType {
  AlreadyAssigned = 'ALREADY_ASSIGNED',
  AlreadyTaken = 'ALREADY_TAKEN',
  DoesNotExist = 'DOES_NOT_EXIST',
  FailedGoogleLogin = 'FAILED_GOOGLE_LOGIN',
  FailedUpload = 'FAILED_UPLOAD',
  MissingGoogleCredentials = 'MISSING_GOOGLE_CREDENTIALS',
  SomethingElse = 'SOMETHING_ELSE',
  Unauthorized = 'UNAUTHORIZED',
  UserAlreadyExists = 'USER_ALREADY_EXISTS',
}
