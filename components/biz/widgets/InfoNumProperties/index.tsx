import { gql } from '@urql/core';
import React from 'react';
import { useQuery } from 'urql';

import { LargeCount } from '@/components/biz/widgets/LargeCount';
import { i18n } from '@/lib/translate';

const numPropertiesQuery = gql`
  query {
    me {
      id
      organization {
        id
        properties {
          id
        }
      }
    }
  }
`;

interface Props {
  className?: string;
}

export function InfoNumProperties(props: Props) {
  const [result] = useQuery({ query: numPropertiesQuery });

  if (result.fetching) {
    return <LargeCount loading className={props.className} />;
  }

  if (!result.data?.me?.organization) {
    return null;
  }

  const num = (result.data.me.organization.properties || []).length;

  return (
    <LargeCount
      count={num}
      label={<i18n.Translate>homes</i18n.Translate>}
      className={props.className}
      loading={false}
    />
  );
}
