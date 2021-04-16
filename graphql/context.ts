import { User } from '@/graphql/types/User';

export interface Context {
  me: User | null;
  jwt: string | null;
}
