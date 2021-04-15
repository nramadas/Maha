import Cors from 'micro-cors';
import { NextApiRequest, NextApiResponse } from 'next';

import { sendEmail } from '@/emails';
import { privateRequest as authnPrivateRequest } from '@/lib/authn/request';

const cors = Cors({
  allowMethods: ['GET', 'POST', 'OPTIONS'],
});

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { account_id, token } = req.body;

    const response = await authnPrivateRequest({
      url: `/accounts/${account_id}`,
      method: 'GET',
    });

    const email: string = response.result.username;

    sendEmail({
      to: email,
      template: 'Authentication',
      props: { email, token },
    });
  }

  res.end();
}

// @ts-ignore
export default cors(async (req: NextApiRequest, res: NextApiResponse) => {
  return req.method === 'OPTIONS' ? res.end() : handler(req, res);
});
