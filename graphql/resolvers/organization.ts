import { AuthenticationError } from 'apollo-server-micro';
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { CreateOrganizationInvite as CreateOrganizationInviteEntity } from '@/db/entities/CreateOrganizationInvite';
import { Organization as OrganizationEntity } from '@/db/entities/Organization';
import { Role as RoleEntity } from '@/db/entities/Role';
import { Context } from '@/graphql/context';
import { CreateOrganizationInput } from '@/graphql/types/CreateOrganizationInput';
import { Organization } from '@/graphql/types/Organization';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel } from '@/lib/modelConversions/organization';

@Resolver(of => Organization)
export class OrganizationResolver {
  constructor(
    @InjectRepository(OrganizationEntity)
    private readonly organizations: Repository<OrganizationEntity>,
    @InjectRepository(CreateOrganizationInviteEntity)
    private readonly createOrganizationInvites: Repository<CreateOrganizationInviteEntity>,
    @InjectRepository(RoleEntity)
    private readonly roles: Repository<RoleEntity>,
  ) {}

  @Authorized()
  @Mutation(returns => Organization, { description: 'Get info for self' })
  async createOrganization(
    @Ctx() ctx: Context,
    @Arg('details') details: CreateOrganizationInput,
  ) {
    const user = ctx.me;

    if (!user) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    const invite = await this.createOrganizationInvites.findOne({
      where: { email: user.email },
    });

    if (!invite) {
      throw new AuthenticationError(ErrorType.Unauthorized);
    }

    try {
      const name = details.name;
      const org = this.organizations.create({ name, data: {} });
      await this.organizations.save(org);

      invite.expired = true;
      await this.createOrganizationInvites.save(invite);

      const role = this.roles.create({
        name: 'OWNER',
        organizationId: org.id,
        userId: parseInt(user.id, 10),
      });

      await this.roles.save(role);

      return convertFromDBModel(org);
    } catch (e) {
      throw new AuthenticationError(ErrorType.SomethingElse);
    }
  }

  @Query(returns => Organization, {
    description: "Given an Organization's id, return the organization",
    nullable: true,
  })
  async organizationById(@Arg('id') id: string) {
    const org = await this.organizations.findOne(id);
    return org ? convertFromDBModel(org) : null;
  }

  @Query(returns => Organization, {
    description: "Given an Organization's name, return the organization",
    nullable: true,
  })
  async organizationByName(@Arg('name') name: string) {
    const org = await this.organizations.findOne({ where: { name } });
    return org ? convertFromDBModel(org) : null;
  }
}
