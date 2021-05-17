import { i18n } from '@/lib/translate';
import { SortType } from '@/models/SortType';

export function enumToText(p: SortType): ReturnType<typeof i18n.translate> {
  switch (p) {
    case SortType.Bedrooms:
      return i18n.translate`# Bedrooms`;
    case SortType.PriceHigh:
      return i18n.translate`Price (High)`;
    case SortType.PriceLow:
      return i18n.translate`Price (Low)`;
    case SortType.PricePerSqft:
      return i18n.translate`Price/Sqft`;
    case SortType.Relevance:
      return i18n.translate`Relevance`;
    case SortType.SqftHigh:
      return i18n.translate`Sqft. (High)`;
    case SortType.SqftLow:
      return i18n.translate`Sqft. (Low)`;
  }
}
