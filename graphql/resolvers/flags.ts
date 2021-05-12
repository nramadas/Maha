import { Arg, FieldResolver, Resolver } from 'type-graphql';

import { Flags } from '@/graphql/types/Flags';
import { Metropolitan } from '@/graphql/types/Metropolitan';
import { MetropolitanKey } from '@/graphql/types/MetropolitanKey';
import { ENABLED_METROPOLITANS } from '@/lib/flags/metropolitan';

@Resolver(of => Flags)
export class FlagsResolver {
  @FieldResolver(type => [Metropolitan], {
    description: 'List of enabled metropolitan areas',
  })
  async enabledMetropolitans() {
    return Array.from(ENABLED_METROPOLITANS).map(key => ({ key }));
  }

  @FieldResolver(type => Boolean, {
    description: 'Returns if a metropolitan is enabled or not',
  })
  async metropolitanIsEnabled(
    @Arg('metropolitan') metropolitan: MetropolitanKey,
  ) {
    return ENABLED_METROPOLITANS.has(metropolitan);
  }
}
