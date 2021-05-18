import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { AppliedFilters } from '@/models/AppliedFilters';

export const applyFilters = (filters: AppliedFilters) => (
  property: MapPropertyModel,
) => {
  for (const [name, value] of Object.entries(filters)) {
    if (value) {
      for (const prefix of ['min', 'max']) {
        if (name.startsWith(prefix)) {
          const [, _prop] = name.split(prefix);
          const prop = (_prop[0].toLowerCase() +
            _prop.slice(1)) as keyof MapPropertyModel;

          const propValue = property[prop];

          if (!propValue) {
            continue;
          }

          if (prefix === 'min' && propValue < value) {
            return false;
          }

          if (prefix === 'max' && propValue > value) {
            return false;
          }
        }
      }
    }
  }

  return true;
};
