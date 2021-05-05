import { i18n } from '@/lib/translate';
import { PropertyCondition } from '@/models/PropertyCondition';

export function enumToText(
  p: PropertyCondition,
): ReturnType<typeof i18n.translate> {
  switch (p) {
    case PropertyCondition.New:
      return i18n.translate`New`;
    case PropertyCondition.Resale:
      return i18n.translate`Resale`;
    case PropertyCondition.Unknown:
      return i18n.translate`Unkown`;
  }
}
