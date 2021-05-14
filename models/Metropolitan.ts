import { MapPoint } from '@/models/MapPoint';
import { MetropolitanKey } from '@/models/MetropolitanKey';

export interface Metropolitan {
  center: MapPoint;
  key: MetropolitanKey;
}
