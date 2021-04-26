import { NominalID } from '@/lib/typeHelpers/nominal';
import type { PropertyId } from '@/models/Property';
import type { UserId } from '@/models/User';

export interface Data {
  memberIds: UserId[];
  propertyIds: PropertyId[];
}

export const DEFAULT_DATA: Data = {
  memberIds: [],
  propertyIds: [],
};

export interface Organization extends Data {
  created: Date;
  id: NominalID<'organization id'>;
  name: string;
}

export type OrganizationId = Organization['id'];
