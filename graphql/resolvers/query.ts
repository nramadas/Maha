import { Arg, Ctx, ID, Query } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Property as PropertyEntity } from '@/db/entities/Property';
import { Role as RoleEntity } from '@/db/entities/Role';
import { School as SchoolEntity } from '@/db/entities/School';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { AddressMatch } from '@/graphql/types/AddressMatch';
import { Flags } from '@/graphql/types/Flags';
import { Location } from '@/graphql/types/Location';
import { Metropolitan } from '@/graphql/types/Metropolitan';
import { MetropolitanKey } from '@/graphql/types/MetropolitanKey';
import { Organization } from '@/graphql/types/Organization';
import { Place } from '@/graphql/types/Place';
import { PlaceSearchType } from '@/graphql/types/PlaceSearchType';
import { Property } from '@/graphql/types/Property';
import { User } from '@/graphql/types/User';
import { convertFromEnum } from '@/lib/modelConversions/metropolitan';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromPropertyDBModel } from '@/lib/modelConversions/property';
import { buildQuery } from '@/lib/url/buildQuery';

export class QueryResolver {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(PropertyEntity)
    private readonly _properties: Repository<PropertyEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(SchoolEntity)
    private readonly _schools: Repository<SchoolEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @Query(returns => Flags, {
    description: 'Feature flags',
  })
  async flags() {
    return {};
  }

  @Query(returns => Location, {
    description: "Convert a place's googleId into a location",
    nullable: true,
  })
  async googleIdToLocation(@Arg('googleId') googleId: string) {
    let url = 'https://maps.googleapis.com/maps/api/place/details/json';
    url += buildQuery({
      fields: 'formatted_address,geometry',
      key: process.env.GOOGLE_PLACES_API_KEY!,
      place_id: googleId,
    });

    const results = await fetch(url).then(res => res.json());

    if (results.result) {
      return {
        address: results.result.formatted_address,
        lat: results.result.geometry?.location?.lat,
        lng: results.result.geometry?.location?.lng,
      };
    }

    return null;
  }

  @Query(returns => Metropolitan, {
    description: 'A list of metropolitan areas',
  })
  async metropolitan(@Arg('key') key: MetropolitanKey) {
    return convertFromEnum(key);
  }

  @Query(returns => [Metropolitan], {
    description: 'A list of metropolitan areas',
  })
  async metropolitans() {
    return Object.values(MetropolitanKey).map(convertFromEnum);
  }

  @Query(returns => Organization, {
    description: "Given an Organization's id, return the organization",
    nullable: true,
  })
  async organizationById(@Arg('id', type => ID) id: string) {
    const dbOrg = await this._organizations.findOne(id);
    return dbOrg ? convertFromOrganizationDBModel(dbOrg) : null;
  }

  @Query(returns => Organization, {
    description: "Given an Organization's name, return the organization",
    nullable: true,
  })
  async organizationByName(@Arg('name') name: string) {
    const dbOrg = await this._organizations.findOne({ where: { name } });
    return dbOrg ? convertFromOrganizationDBModel(dbOrg) : null;
  }

  @Query(returns => Property, {
    description: "Given a Property's id, return the property",
    nullable: true,
  })
  async propertyById(@Arg('id', type => ID) id: string) {
    const dbProperty = await this._properties.findOne(id);
    return dbProperty ? convertFromPropertyDBModel(dbProperty) : null;
  }

  @Query(returns => [Place], {
    description: 'Get a list of locations that match a search text',
  })
  async matchingPlaces(
    @Arg('text') text: string,
    @Arg('type', type => PlaceSearchType, { nullable: true })
    type?: PlaceSearchType,
  ) {
    let url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
    url += buildQuery({
      input: text,
      key: process.env.GOOGLE_PLACES_API_KEY!,
      type,
    });

    const results = await fetch(url).then(res => res.json());

    return results.results.map((r: any) => ({
      googleId: r.place_id,
      name: r.name,
      location: {
        address: r.formatted_address,
        lat: r.geometry?.location?.lat,
        lng: r.geometry?.location?.lng,
      },
    }));
  }

  @Query(returns => [AddressMatch], {
    description: 'Get a list of locations that match an address',
  })
  async matchingAddress(@Arg('address') address: string) {
    let url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';
    url += buildQuery({
      components: 'country:in',
      input: address,
      key: process.env.GOOGLE_PLACES_API_KEY!,
    });

    const results = await fetch(url).then(res => res.json());

    return results.predictions.map((p: any) => ({
      address: p.description,
      googleId: p.place_id,
    }));
  }

  @Query(returns => User, { description: 'Get info for self', nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.me;
  }
}
