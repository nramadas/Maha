import respositories from '@/db/repositories';
import { Context } from '@/graphql/context';
import { extractAuthId } from '@/lib/authn/token';
import { log } from '@/lib/log/server';
import { convertFromDBModel as convertFromOrganizationDBModel } from '@/lib/modelConversions/organization';
import { convertFromDBModel as convertFromRoleDBModel } from '@/lib/modelConversions/role';
import { convertFromDBModel as convertFromUserDBModel } from '@/lib/modelConversions/user';

interface Headers {
  authorization?: string;
}

const ERR: Context = {
  jwt: null,
  me: null,
  organization: null,
  roles: [],
};

export async function contextFromHeaders<H extends Headers>(headers: H) {
  if (!headers.authorization || !headers.authorization.startsWith('Bearer ')) {
    return ERR;
  }

  const [, jwt] = headers.authorization.split('Bearer ');

  try {
    const authId = await extractAuthId(jwt);

    if (!authId) {
      return ERR;
    }

    const user = await respositories.User().findOne({
      where: { authId },
      relations: ['organization', 'roles'],
    });

    if (!user) {
      return ERR;
    }

    const roles = user.roles.map(convertFromRoleDBModel);
    const organization = user.organization
      ? convertFromOrganizationDBModel(user.organization)
      : null;

    const me = convertFromUserDBModel(user);

    const context: Context = {
      jwt,
      me,
      roles,
      organization,
    };
    return context;
  } catch (e) {
    log({
      error: true,
      subject: 'Could not establish user',
      text: e.toString(),
    });
    return ERR;
  }
}
