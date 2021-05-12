import { gql } from '@urql/core';
import React from 'react';
import { useMutation } from 'urql';

import { ErrorType } from '@/lib/errors/type';

import { Form } from './Form';

const joinOrganizationMutation = gql`
  mutation(
    $orgName: String!
    $firstName: String!
    $lastName: String!
    $phoneNumber: String!
  ) {
    joinOrganization(
      organizationName: $orgName
      firstName: $firstName
      lastName: $lastName
      phoneNumber: $phoneNumber
    ) {
      id
      name
    }
  }
`;

interface Payload {
  id: string;
  name: string;
}

interface Props {
  orgName: string;
  onComplete(payload: Payload): void;
}

export function JoinOrganization(props: Props) {
  const { orgName, onComplete } = props;
  const [result, join] = useMutation(joinOrganizationMutation);

  return (
    <Form
      error={result.error?.graphQLErrors[0].message as ErrorType}
      onSubmit={({ firstName, lastName, phoneNumber }) => {
        join({ firstName, lastName, phoneNumber, orgName }).then(response => {
          if (!response.error) {
            const { id, name } = response.data.joinOrganization;
            onComplete({ id, name });
          }
        });
      }}
    />
  );
}
