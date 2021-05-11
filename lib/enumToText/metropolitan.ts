import { i18n } from '@/lib/translate';
import { MetropolitanKey } from '@/models/MetropolitanKey';

export function enumToText(
  p: MetropolitanKey,
): ReturnType<typeof i18n.translate> {
  switch (p) {
    case MetropolitanKey.Ahmedabad:
      return i18n.translate`Ahmedabad`;
    case MetropolitanKey.Bengaluru:
      return i18n.translate`Bengaluru`;
    case MetropolitanKey.Chennai:
      return i18n.translate`Chennai`;
    case MetropolitanKey.Delhi:
      return i18n.translate`Delhi`;
    case MetropolitanKey.Hyderabad:
      return i18n.translate`Hyderabad`;
    case MetropolitanKey.Kolkata:
      return i18n.translate`Kolkata`;
    case MetropolitanKey.Mumbai:
      return i18n.translate`Mumbai`;
    case MetropolitanKey.Thiruvananthapuram:
      return i18n.translate`Thiruvananthapuram`;
    case MetropolitanKey.Visakhapatnam:
      return i18n.translate`Visakhapatnam`;
  }
}
