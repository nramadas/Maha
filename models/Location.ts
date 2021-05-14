import { MapPoint } from '@/models/MapPoint';

export interface Location extends Partial<MapPoint> {
  address: string;
}
