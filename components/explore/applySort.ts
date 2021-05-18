import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { inBounds as _inBounds, locationToMapPoint } from '@/lib/map';
import { MapBounds } from '@/models/MapBounds';
import { MapPoint } from '@/models/MapPoint';
import { SortType } from '@/models/SortType';

function inBounds(point: MapPoint, bounds: MapBounds) {
  if (!(bounds.ne && bounds.sw)) {
    return false;
  }

  // @ts-ignore
  return _inBounds(point, bounds);
}

const nameSort = (a: MapPropertyModel, b: MapPropertyModel) =>
  a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());

const bedroomsSort = (a: MapPropertyModel, b: MapPropertyModel) => {
  if (a.numBedrooms < b.numBedrooms) {
    return 1;
  } else if (a.numBedrooms > b.numBedrooms) {
    return -1;
  } else {
    return nameSort(a, b);
  }
};

const priceHighSort = (a: MapPropertyModel, b: MapPropertyModel) => {
  if (a.price < b.price) {
    return 1;
  } else if (a.price > b.price) {
    return -1;
  } else {
    return nameSort(a, b);
  }
};

const priceLowSort = (a: MapPropertyModel, b: MapPropertyModel) => {
  if (a.price < b.price) {
    return -1;
  } else if (a.price > b.price) {
    return 1;
  } else {
    return nameSort(a, b);
  }
};

const pricePerSqftSort = (a: MapPropertyModel, b: MapPropertyModel) => {
  const aVal = a.price / a.sqft;
  const bVal = b.price / b.sqft;

  if (aVal < bVal) {
    return -1;
  } else if (aVal > bVal) {
    return 1;
  } else {
    return nameSort(a, b);
  }
};

const relevanceSort = (
  a: MapPropertyModel,
  b: MapPropertyModel,
  bounds: MapBounds,
) => {
  const aPoint = locationToMapPoint(a.location);
  const bPoint = locationToMapPoint(b.location);

  // 1. Prioritize properties with explicit lat/lng
  if (aPoint && !bPoint) {
    return -1;
  }

  if (bPoint && !aPoint) {
    return 1;
  }

  // 2. Prioritize properties that are in the viewport
  if (aPoint && bPoint) {
    if (inBounds(aPoint, bounds) && !inBounds(bPoint, bounds)) {
      return -1;
    }

    if (!inBounds(aPoint, bounds) && inBounds(bPoint, bounds)) {
      return 1;
    }
  }

  // Finally, sort by value
  return pricePerSqftSort(a, b);
};

const sqftHighSort = (a: MapPropertyModel, b: MapPropertyModel) => {
  if (a.sqft < b.sqft) {
    return 1;
  } else if (a.sqft > b.sqft) {
    return -1;
  } else {
    return nameSort(a, b);
  }
};

const sqftLowSort = (a: MapPropertyModel, b: MapPropertyModel) => {
  if (a.sqft < b.sqft) {
    return -1;
  } else if (a.sqft > b.sqft) {
    return 1;
  } else {
    return nameSort(a, b);
  }
};

export const applySort = (sortType: SortType, bounds: MapBounds) => (
  a: MapPropertyModel,
  b: MapPropertyModel,
) => {
  switch (sortType) {
    case SortType.Bedrooms:
      return bedroomsSort(a, b);
    case SortType.PriceHigh:
      return priceHighSort(a, b);
    case SortType.PriceLow:
      return priceLowSort(a, b);
    case SortType.PricePerSqft:
      return pricePerSqftSort(a, b);
    case SortType.Relevance:
      return relevanceSort(a, b, bounds);
    case SortType.SqftHigh:
      return sqftHighSort(a, b);
    case SortType.SqftLow:
      return sqftLowSort(a, b);
    default:
      return nameSort(a, b);
  }
};
