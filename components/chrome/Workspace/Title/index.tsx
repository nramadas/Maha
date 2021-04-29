import cx from 'classnames';
import Link from 'next/link';
import React from 'react';

import { Empty } from '@/components/controls/links/Empty';
import { Logo } from '@/components/Logo';
import { Organization } from '@/models/Organization';

import styles from './index.module.scss';

interface Props {
  className?: string;
  organization: Pick<Organization, 'name'>;
}

export function Title(props: Props) {
  const { className, organization } = props;
  const { name } = organization;

  return (
    <div className={cx(styles.container, className)}>
      <Logo className={styles.logo} />
      <Link href="/biz/">
        <Empty className={styles.button}>{name}</Empty>
      </Link>
    </div>
  );
}
