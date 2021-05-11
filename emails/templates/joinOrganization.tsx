import React from 'react';
import { useTheme } from 'styled-components';

import * as buttons from '@/emails/components/buttons';
import { Container } from '@/emails/components/Container';
import { Title } from '@/emails/components/Title';
import { Email } from '@/emails/models';
import { buildQuery } from '@/lib/url/buildQuery';
import { EmailAction } from '@/models/EmailAction';

interface Props {
  email: string;
  organizationName: string;
  token: string;
}

export const JoinOrganization: Email<Props> = {
  rawText: "You've been added to a company on Maha",
  subject: "You've been added to a company on Maha",
  Template: props => {
    const theme = useTheme();
    const query = buildQuery({
      action: EmailAction.JoinOrganization,
      email: props.email,
      orgName: props.organizationName,
      token: props.token,
    });

    return (
      <Container>
        <Title>Welcome to Maha!</Title>
        <p>
          You have been invited to join {props.organizationName} on{' '}
          <span style={{ color: theme.primary, fontWeight: 'bold' }}>Maha</span>
          . After you finish the login process, you will be able to access{' '}
          {props.organizationName}'s company page at{' '}
          <a href={`${process.env.APP_URL}/biz`}>{process.env.APP_URL}/biz</a>.
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
