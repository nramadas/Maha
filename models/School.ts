import { NominalID } from '@/lib/typeHelpers/nominal';
import { Location } from '@/models/Location';
import { SchoolType } from '@/models/SchoolType';

export interface Data {
  location: Location;
}

export const DEFAULT_DATA: Data = {
  location: {
    address: '',
  },
};

export interface School extends Data {
  id: NominalID<'school id'>;
  googleId?: NominalID<'school google id'>;
  name: string;
  type?: SchoolType;
}
