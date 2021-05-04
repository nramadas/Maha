import { Arg, Ctx, ID, Query } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { User as UserEntity } from '@/db/entities/User';
import { Context } from '@/graphql/context';
import { Organization } from '@/graphql/types/Organization';
import { Place } from '@/graphql/types/Place';
import { Places } from '@/graphql/types/Places';
import { User } from '@/graphql/types/User';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';

export class QueryResolver {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
    @InjectRepository(OrganizationEntity)
    private readonly _organizations: Repository<OrganizationEntity>,
    @InjectRepository(RoleEntity)
    private readonly _roles: Repository<RoleEntity>,
    @InjectRepository(UserEntity)
    private readonly _users: Repository<UserEntity>,
  ) {}

  @Query(returns => Organization, {
    description: "Given an Organization's id, return the organization",
    nullable: true,
  })
  async organizationById(@Arg('id', type => ID) id: string) {
    const org = await this._organizations.findOne(id);
    return org ? convertFromOrganizationDBModel(org) : null;
  }

  @Query(returns => Organization, {
    description: "Given an Organization's name, return the organization",
    nullable: true,
  })
  async organizationByName(@Arg('name') name: string) {
    const org = await this._organizations.findOne({ where: { name } });
    return org ? convertFromOrganizationDBModel(org) : null;
  }

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

  @Query(returns => User, { description: 'Get info for self', nullable: true })
  me(@Ctx() ctx: Context) {
    return ctx.me;
  }
}
