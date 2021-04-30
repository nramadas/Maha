import { gql } from '@urql/core';
import React from 'react';
import { useMutation } from 'urql';

import { ErrorType } from '@/lib/errors/type';

import { Form } from './Form';

const createOrganization = gql`
  mutation($name: String!) {
    createOrganization(details: { name: $name }) {
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
  onComplete(payload: Payload): void;
}

export function CreateOrganization(props: Props) {
  const { onComplete } = props;
  const [result, create] = useMutation(createOrganization);

  return (
    <Form
      error={result.error?.graphQLErrors[0].message as ErrorType}
      onSubmit={({ name }) => {
        create({ name }).then(response => {
          if (!response.error) {
            const { id, name } = response.data.createOrganization;
            onComplete({ id, name });
          }
        });
      }}
    />
  );
}
