import { InviteType } from '@/models/InviteType';
import { Organization } from '@/models/Organization';

export interface Data {}

export const DEFAULT_DATA: Data = {};

export interface Invite extends Data {
  created: Date;
  email: string;
  expired: boolean;
  id: string;
  organizationId?: Organization['id'];
  type: InviteType;
}
