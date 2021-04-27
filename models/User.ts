import { NominalID } from '@/lib/typeHelpers/nominal';
import { Gender } from '@/models/Gender';
import { Language } from '@/models/Language';

export interface Data {
  firstName?: string;
  gender?: Gender;
  lastName?: string;
  phoneNumber?: string;
  preferredLanguage?: Language;
}

export const DEFAULT_DATA: Data = {};

export interface User extends Data {
  created: Date;
  email: string;
  organizationId?: string;
  id: NominalID<'user id'>;
}

export type UserId = User['id'];
