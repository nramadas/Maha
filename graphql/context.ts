import { Organization } from '@/models/Organization';
import { Role } from '@/models/Role';
import { User } from '@/models/User';

export interface Context {
  jwt: string | null;
  me: User | null;
  organization: Organization | null;
  roles: Role[];
}
