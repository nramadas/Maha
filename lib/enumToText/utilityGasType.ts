import { i18n } from '@/lib/translate';
import { UtilityGasType } from '@/models/UtilityGasType';

export function enumToText(
  p: UtilityGasType,
): ReturnType<typeof i18n.translate> {
  switch (p) {
    case UtilityGasType.Integrated:
      return i18n.translate`Integrated gas`;
    case UtilityGasType.Canister:
      return i18n.translate`Canister gas`;
    case UtilityGasType.None:
      return i18n.translate`None`;
  }
}
