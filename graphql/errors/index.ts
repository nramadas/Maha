import { ApolloError } from 'apollo-server-errors';

import { ErrorType } from '@/lib/errors/type';

export class AlreadyAssigned extends ApolloError {
  constructor(field: string, value: string) {
    super(ErrorType.AlreadyAssigned, ErrorType.AlreadyAssigned, {
      field,
      value,
    });
  }
}

export class AlreadyTaken extends ApolloError {
  constructor(field: string, value: any) {
    super(ErrorType.AlreadyTaken, ErrorType.AlreadyTaken, {
      field,
      value,
    });
  }
}

export class DoesNotExist extends ApolloError {
  constructor(field: string, reference: any) {
    super(ErrorType.AlreadyTaken, ErrorType.AlreadyTaken, {
      field,
      reference,
    });
  }
}

export class FailedFileParse extends ApolloError {
  constructor(filename: string) {
    super(ErrorType.FailedFileParse, ErrorType.FailedFileParse, {
      filename,
    });
  }
}

export class FailedUpload extends ApolloError {
  constructor(filename: string) {
    super(ErrorType.FailedFileParse, ErrorType.FailedFileParse, {
      filename,
    });
  }
}

export class SomethingElse extends ApolloError {
  constructor() {
    super(ErrorType.SomethingElse, ErrorType.SomethingElse);
  }
}

export class Unauthorized extends ApolloError {
  constructor() {
    super(ErrorType.Unauthorized, ErrorType.Unauthorized);
  }
}
