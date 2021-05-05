import { i18n } from '@/lib/translate';
import { UtilityWaterFilter } from '@/models/UtilityWaterFilter';

export function enumToText(
  p: UtilityWaterFilter,
): ReturnType<typeof i18n.translate> {
  switch (p) {
    case UtilityWaterFilter.CentrallyFiltered:
      return i18n.translate`Centrally filtered water`;
    case UtilityWaterFilter.TapFiltered:
      return i18n.translate`Filters are attached to taps`;
    case UtilityWaterFilter.NoFilter:
      return i18n.translate`No water filters`;
  }
}
