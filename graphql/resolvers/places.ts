import { Arg, Query, Resolver } from 'type-graphql';

import { Place } from '@/graphql/types/Place';
import { Places } from '@/graphql/types/Places';

@Resolver(of => Places)
export class PlacesResolver {
  @Query(returns => Places, {
    description: 'Get a list of places that match a search address',
  })
  async matchingAddresses(@Arg('address') address: string) {
    const results = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${address}&key=${process.env.GOOGLE_API_KEY}`,
    ).then(res => res.json());

    return {
      places: results.predictions.map((p: any) => ({
        address: p.description,
      })) as Place[],
    };
  }
}
