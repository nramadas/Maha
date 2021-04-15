import { NominalID } from '@/lib/typeHelpers/nominal';

export interface Data {}

export const DEFAULT_DATA: Data = {};

export interface User extends Data {
  created: Date;
  email: string;
  id: NominalID<'id'>;
}
