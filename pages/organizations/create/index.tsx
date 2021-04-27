import { useRouter } from 'next/router';
import React from 'react';

import { CreateOrganization } from '@/components/CreateOrganization';

import styles from './index.module.scss';

export default function CreateOrganizationPage() {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <CreateOrganization
          onComplete={({ id }) => {
            router.push(`/organization/${id}/setup`);
          }}
        />
      </div>
    </div>
  );
}
