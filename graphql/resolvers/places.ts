import { Resolver } from 'type-graphql';

import { Places } from '@/graphql/types/Places';

@Resolver(of => Places)
export class PlacesResolver {}
