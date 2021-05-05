import { i18n } from '@/lib/translate';
import { UtilityConfiguration } from '@/models/UtilityConfiguration';

export function enumToText(
  p: UtilityConfiguration,
): ReturnType<typeof i18n.translate> {
  switch (p) {
    case UtilityConfiguration.Central:
      return i18n.translate`Central`;
    case UtilityConfiguration.PerRoom:
      return i18n.translate`On a per-room basis`;
    case UtilityConfiguration.None:
      return i18n.translate`None`;
  }
}
