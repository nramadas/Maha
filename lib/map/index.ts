import { Location } from '@/models/Location';
import { MapPoint } from '@/models/MapPoint';

interface MapBounds {
  ne: MapPoint;
  sw: MapPoint;
}

export function inBounds(point: MapPoint, bounds: MapBounds) {
  return !(
    point.lat > bounds.ne.lat ||
    point.lat < bounds.sw.lat ||
    point.lng > bounds.ne.lng ||
    point.lng < bounds.sw.lng
  );
}

export function locationToMapPoint(location: Location): MapPoint | null {
  if (!(location.lat && location.lng)) {
    return null;
  }

  return {
    lat: location.lat,
    lng: location.lng,
  };
}
