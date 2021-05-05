import { i18n } from '@/lib/translate';
import { PropertyType } from '@/models/PropertyType';

export function enumToText(p: PropertyType): ReturnType<typeof i18n.translate> {
  switch (p) {
    case PropertyType.Apartment:
      return i18n.translate`Apartment`;
    case PropertyType.Flat:
      return i18n.translate`Flat`;
    case PropertyType.House:
      return i18n.translate`House`;
  }
}
