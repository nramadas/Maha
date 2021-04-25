import { NominalID } from '@/lib/typeHelpers/nominal';
import type { PropertyId } from '@/models/Property';
import type { UserId } from '@/models/User';

export interface Organization {
  id: NominalID<'organization id'>;
  name: string;
  memberIds: UserId[];
  propertyIds: PropertyId[];
}

export type OrganizationId = Organization['id'];
