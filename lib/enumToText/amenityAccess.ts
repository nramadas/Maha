import { i18n } from '@/lib/translate';
import { AmenityAccess } from '@/models/AmenityAccess';

export function enumToText(
  p: AmenityAccess,
): ReturnType<typeof i18n.translate> {
  switch (p) {
    case AmenityAccess.Private:
      return i18n.translate`Private`;
    case AmenityAccess.Shared:
      return i18n.translate`Shared`;
    case AmenityAccess.None:
      return i18n.translate`None`;
  }
}
