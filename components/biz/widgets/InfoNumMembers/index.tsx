import { gql } from '@urql/core';
import cx from 'classnames';
import React from 'react';
import { useQuery } from 'urql';

import { H1 } from '@/components/typography/H1';
import { H3 } from '@/components/typography/H3';
import { i18n } from '@/lib/translate';

import styles from './index.module.scss';

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

  if (!result.data?.me?.organization) {
    return null;
  }

  const num = (result.data.me.organization.members || []).length;

  return (
    <div className={cx(props.className, styles.container)}>
      <H1>{num}</H1>
      <H3>
        <i18n.Translate>members</i18n.Translate>
      </H3>
    </div>
  );
}
