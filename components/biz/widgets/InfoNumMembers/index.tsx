import { gql } from '@urql/core';
import React from 'react';
import { useQuery } from 'urql';

import { LargeCount } from '@/components/biz/widgets/LargeCount';
import { i18n } from '@/lib/translate';

const numMembersQuery = gql`
  query {
    me {
      id
      organization {
        id
        members {
          id
        }
      }
    }
  }
`;

interface Props {
  className?: string;
}

export function InfoNumMembers(props: Props) {
  const [result] = useQuery({ query: numMembersQuery });

  if (result.fetching) {
    return <LargeCount loading className={props.className} />;
  }

  if (!result.data?.me?.organization) {
    return null;
  }

  const num = (result.data.me.organization.members || []).length;

  return (
    <LargeCount
      count={num}
      label={<i18n.Translate>members</i18n.Translate>}
      className={props.className}
      loading={false}
    />
  );
}
