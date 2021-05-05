import { ValidationError } from 'apollo-server-micro';
import { Authorized, FieldResolver, Resolver, Root } from 'type-graphql';
import { Repository } from 'typeorm';
import { InjectRepository } from 'typeorm-typedi-extensions';

import { Invite as InviteEntity } from '@/db/entities/Invite';
import { Invite } from '@/graphql/types/Invite';
import { Permission } from '@/graphql/types/Permission';
import { Role } from '@/graphql/types/Role';
import { ErrorType } from '@/lib/errors/type';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';

@Resolver(of => Invite)
export class InviteResolver {
  constructor(
    @InjectRepository(InviteEntity)
    private readonly _invites: Repository<InviteEntity>,
  ) {}

  @Authorized(Permission.ModifyRoles)
  @FieldResolver(type => [Role])
  async roles(@Root() root: Invite) {
    const dbInvite = await this._invites.findOne({
      where: { id: root.id },
      relations: ['roles'],
    });

    if (!dbInvite) {
      throw new ValidationError(ErrorType.SomethingElse);
    }

    return dbInvite.roles.map(convertFromRoleDBModel);
  }
}
