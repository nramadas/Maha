import { LandmarkType } from '@/models/LandmarkType';
import { School } from '@/models/School';

export interface SchoolLandmark<S extends Partial<School>> {
  type: LandmarkType.School;
  model: S;
}

export type Landmark<S> = SchoolLandmark<S>;
