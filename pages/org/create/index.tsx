import { useRouter } from 'next/router';
import React from 'react';

import { CreateOrganization } from '@/components/CreateOrganization';
import { Route } from '@/lib/route';

import styles from './index.module.scss';

export default function CreateOrganizationPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <CreateOrganization
          onComplete={() => {
            router.push(Route.BizLandingPage);
          }}
        />
      </div>
    </div>
  );
}
