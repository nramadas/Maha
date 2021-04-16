import respositories from '@/db/repositories';
import { Context } from '@/graphql/context';
import { extractAuthId } from '@/lib/authn/token';
import { log } from '@/lib/log/server';
import { covertFromDBModel } from '@/lib/modelConversions/user';

interface Headers {
  authorization?: string;
}

const ERR: Context = {
  me: null,
  jwt: null,
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
    });

    if (!user) {
      return ERR;
    }

    const me = covertFromDBModel(user);
    return { me, jwt };
  } catch (e) {
    log({
      error: true,
      subject: 'Could not establish user',
      text: e.toString(),
    });
    return ERR;
  }
}
