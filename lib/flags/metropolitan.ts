import { Metropolitan } from '@/models/Metropolitan';

const ENABLED_METROPOLITANS = new Set<Metropolitan>([Metropolitan.Bengaluru]);

export function enabled(m: Metropolitan) {
  return ENABLED_METROPOLITANS.has(m);
}
