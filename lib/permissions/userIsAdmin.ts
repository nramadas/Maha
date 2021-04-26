import { User } from '@/models/User';

const ADMIN_IDS = new Set<User['id']>(
  (process.env.ADMIN_USERS || '').split(','),
);

export function userIsAdmin(user: User) {
  return ADMIN_IDS.has(user.id);
}
