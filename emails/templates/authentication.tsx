import React from 'react';

import { Email } from '@/emails/models';
import { buildQuery } from '@/lib/url/buildQuery';

interface Props {
  email: string;
  token: string;
}

export const Authentication: Email<Props> = {
  rawText: 'Click to continue to Maha',
  subject: 'Continue to log in to Maha',
  Template: props => {
    const query = buildQuery({
      email: props.email,
      token: props.token,
    });

    return (
      <div>
        <a href={`${process.env.APP_URL}/auth/continue${query}`}>
          Click here to continue to Maha
        </a>
      </div>
    );
  },
};
