import { i18n } from '@/lib/translate';
import { Metropolitan } from '@/models/Metropolitan';

export function enumToText(p: Metropolitan): ReturnType<typeof i18n.translate> {
  switch (p) {
    case Metropolitan.Ahmedabad:
      return i18n.translate`Ahmedabad`;
    case Metropolitan.Bengaluru:
      return i18n.translate`Bengaluru`;
    case Metropolitan.Chennai:
      return i18n.translate`Chennai`;
    case Metropolitan.Delhi:
      return i18n.translate`Delhi`;
    case Metropolitan.Hyderabad:
      return i18n.translate`Hyderabad`;
    case Metropolitan.Kolkata:
      return i18n.translate`Kolkata`;
    case Metropolitan.Mumbai:
      return i18n.translate`Mumbai`;
    case Metropolitan.Thiruvananthapuram:
      return i18n.translate`Thiruvananthapuram`;
    case Metropolitan.Visakhapatnam:
      return i18n.translate`Visakhapatnam`;
  }
}
