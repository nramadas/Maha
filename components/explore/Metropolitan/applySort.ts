import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { inBounds as _inBounds, locationToMapPoint } from '@/lib/map';
import { MapPoint } from '@/models/MapPoint';

interface MapBounds {
  ne?: MapPoint;
  sw?: MapPoint;
}

function inBounds(point: MapPoint, bounds: MapBounds) {
  if (!(bounds.ne && bounds.sw)) {
    return false;
  }

  // @ts-ignore
  return _inBounds(point, bounds);
}

export const applySort = (bounds: MapBounds) => (
  a: MapPropertyModel,
  b: MapPropertyModel,
) => {
  const aPoint = locationToMapPoint(a.location);
  const bPoint = locationToMapPoint(b.location);

  // 1. Priorities properties with explicit lat/lng
  if (aPoint && !bPoint) {
    return -1;
  }

  if (bPoint && !aPoint) {
    return 1;
  }

  // 2. Priorities properties that are in the viewport
  if (aPoint && bPoint) {
    if (inBounds(aPoint, bounds) && !inBounds(bPoint, bounds)) {
      return -1;
    }

    if (!inBounds(aPoint, bounds) && inBounds(bPoint, bounds)) {
      return 1;
    }
  }

  // Finally, just sort by name
  return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
};
