import isNil from 'lodash/isNil';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { toParts } from '@/lib/date';
import { AppliedFilters } from '@/models/AppliedFilters';

export const applyFilters = (filters: AppliedFilters) => (
  property: MapPropertyModel,
) => {
  for (const [name, value] of Object.entries(filters)) {
    if (!isNil(value)) {
      if (name === 'minYearBuilt' || name === 'maxYearBuilt') {
        if (property.built) {
          const yearBuilt = toParts(new Date(property.built)).year;

          if (name === 'minYearBuilt' && yearBuilt < value) {
            return false;
          }

          if (name === 'maxYearBuilt' && yearBuilt > value) {
            return false;
          }
        }
      } else if (name === 'minParkingSpaces') {
        let totalSpaces = 0;
        totalSpaces += property.parkingCoveredSpaces || 0;
        totalSpaces += property.parkingOpenSpaces || 0;
        if (totalSpaces < value) {
          return false;
        }
      } else if (name.startsWith('equals')) {
        const [, _prop] = name.split('equals');
        const prop = (_prop[0].toLowerCase() +
          _prop.slice(1)) as keyof MapPropertyModel;

        const propValue = property[prop];

        if (propValue !== value) {
          return false;
        }
      } else {
        for (const prefix of ['min', 'max']) {
          if (name.startsWith(prefix)) {
            const [, _prop] = name.split(prefix);
            const prop = (_prop[0].toLowerCase() +
              _prop.slice(1)) as keyof MapPropertyModel;

            const propValue = property[prop];

            if (!propValue) {
              return false;
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
  }

  return true;
};
