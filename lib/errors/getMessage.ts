import { ErrorType } from '@/lib/errors/type';
import { i18n } from '@/lib/translate';

export function getMessage(type: ErrorType): ReturnType<typeof i18n.translate> {
  switch (type) {
    case ErrorType.AlreadyAssigned:
      return i18n.translate`That's already been assigned.`;
    case ErrorType.AlreadyTaken:
      return i18n.translate`That's already taken. Why not try something else?`;
    case ErrorType.DoesNotExist:
      return i18n.translate`This does not exist`;
    case ErrorType.FailedFileParse:
      return i18n.translate`Could not read file`;
    case ErrorType.FailedUpload:
      return i18n.translate`Could not upload file`;
    case ErrorType.Unauthorized:
      return i18n.translate`You are unauthorized to perform that action`;
    case ErrorType.SomethingElse:
      return i18n.translate`Something went wrong`;
  }
}
