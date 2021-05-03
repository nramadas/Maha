import React from 'react';
import { useTheme } from 'styled-components';

import { Email } from '@/emails/models';
import { buildQuery } from '@/lib/url/buildQuery';
import { EmailAction } from '@/models/EmailAction';

interface Props {
  email: string;
  token: string;
}

export const CreateOrganization: Email<Props> = {
  rawText: 'You are invited to join Maha!',
  subject: 'Finish setting up your company on Maha',
  Template: props => {
    const theme = useTheme();
    const query = buildQuery({
      action: EmailAction.CreateOrganization,
      email: props.email,
      token: props.token,
    });

    return (
      <div
        style={{
          backgroundColor: theme.field,
          borderRadius: 24,
          fontFamily: theme.font,
          padding: 12,
        }}
      >
        <h1 style={{ color: theme.primary }}>Welcome to Maha!</h1>
        <p>
          You have been invited to set up your company on{' '}
          <span style={{ color: theme.primary, fontWeight: 'bold' }}>Maha</span>
          . After you finish the setup process, you will be able to list your
          properties for sale, add your employees, and get valuable data
          insights.
        </p>
        <p>
          <a href={`${process.env.APP_URL}/auth/continue${query}`}>
            Click here to continue to Maha
          </a>
        </p>
      </div>
    );
  },
};
