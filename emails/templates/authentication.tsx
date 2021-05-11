import React from 'react';

import * as buttons from '@/emails/components/buttons';
import { Container } from '@/emails/components/Container';
import { Title } from '@/emails/components/Title';
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
      <Container>
        <Title>Complete your log in</Title>
        <p>
          After you log in, you'll be able to favorite properties, schedule
          on-site visits, and get in touch with the property developers!
        </p>
        <p style={{ paddingTop: 12 }}>
          <buttons.Filled href={`${process.env.APP_URL}/auth/continue${query}`}>
            Continue to Maha
          </buttons.Filled>
        </p>
      </Container>
    );
  },
};
