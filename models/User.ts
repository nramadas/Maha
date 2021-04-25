import { NominalID } from '@/lib/typeHelpers/nominal';
import { Gender } from '@/models/Gender';
import { Language } from '@/models/Language';

export interface Data {
  firstName?: string;
  lastName?: string;
  gender?: Gender;
  preferredLanguage?: Language;
  phoneNumber?: string;
}

export const DEFAULT_DATA: Data = {};

export interface User extends Data {
  created: Date;
  email: string;
  id: NominalID<'user id'>;
}

export type UserId = User['id'];
