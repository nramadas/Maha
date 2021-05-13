import { gql } from '@urql/core';
import React from 'react';
import { useMutation, useQuery } from 'urql';

import { Shimmer } from '@/components/loading/Shimmer';
import { H4 } from '@/components/typography/H4';
import { useDisplayError } from '@/hooks/useDisplayNotification';
import { i18n } from '@/lib/translate';

import { Add, Role } from './Add';
import styles from './index.module.scss';
import { Invite, Invites } from './Invites';

const infoQuery = gql`
  query {
    me {
      id
      organization {
        id
        roles {
          id
          name
        }
        pendingInvites {
          id
          email
          roles {
            id
            name
          }
        }
      }
    }
  }
`;

const createInviteMutation = gql`
  mutation($email: String!, $roleIds: [ID!]!) {
    inviteUserToOrganization(email: $email, roleIds: $roleIds) {
      id
      email
      roles {
        id
        name
      }
    }
  }
`;

interface Props {
  className?: string;
}

export function AddMember(props: Props) {
  const [infoResult] = useQuery({ query: infoQuery });
  const [, createInvite] = useMutation(createInviteMutation);
  const displayError = useDisplayError();

  const organization = infoResult.data?.me?.organization || {};
  const invites: Invite[] = organization.pendingInvites || [];
  const roles: Role[] = organization.roles || [];
  const addKey = invites.map(i => i.email).join(',');

  return (
    <div className={props.className}>
      <header>
        <H4>
          <i18n.Translate>Add member</i18n.Translate>
        </H4>
      </header>
      {infoResult.fetching ? (
        <Shimmer className={styles.shimmer} />
      ) : (
        <article className={styles.form}>
          <Add
            key={addKey}
            roles={roles}
            onSubmit={formValues => {
              createInvite({
                email: formValues.email,
                roleIds: formValues.roles.map(r => r.id),
              }).then(result => {
                if (result.error) {
                  displayError(i18n.translate`Could not add member`);
                }
              });
            }}
          />
        </article>
      )}
      {!!invites.length && (
        <footer className={styles.invites}>
          <Invites invites={invites} />
        </footer>
      )}
    </div>
  );
}
