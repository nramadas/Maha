import once from 'lodash/once';
import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { connectToDb } from '@/db';
import repos from '@/db/repositories';
import { sendEmail } from '@/emails';
import { getEmail } from '@/lib/authn/api';

const dbConnect = once(() => connectToDb());

const cors = Cors({
  allowMethods: ['GET', 'POST', 'OPTIONS'],
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { account_id, token } = req.body;

    const response = await getEmail(account_id);

    if (response.ok) {
      const email = response.email;

      await dbConnect();

      const invite = await repos
        .CreateOrganizationInvite()
        .findOne({ where: { email } });

      if (invite) {
        sendEmail({
          to: email,
          template: 'CreateOrganization',
          props: { email, token },
        });
      } else {
        sendEmail({
          to: email,
          template: 'Authentication',
          props: { email, token },
        });
      }
    }
  }

  res.end();
}

// @ts-ignore
export default cors(async (req: NextApiRequest, res: NextApiResponse) => {
  return req.method === 'OPTIONS' ? res.end() : handler(req, res);
});
