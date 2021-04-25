import { NominalID } from '@/lib/typeHelpers/nominal';
import { Place } from '@/models/Place';

export interface Data {
  location: Place;
}

export const DEFAULT_DATA: Data = {
  location: {
    address: '',
  },
};

export interface School extends Data {
  id: NominalID<'school id'>;
  name: string;
}
