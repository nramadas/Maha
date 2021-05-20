import React, { memo } from 'react';

import { Close } from '@/components/icons/Close';
import { Shimmer } from '@/components/loading/Shimmer';
import { useBottomSheet } from '@/hooks/useBottomSheet';

import styles from './index.module.scss';

interface Props {
  propertyId: string;
}

export const Loading = memo(function Loading(props: Props) {
  const [, closeDetails] = useBottomSheet(props.propertyId);

  return (
    <>
      <header className={styles.header}>
        <Shimmer className={styles.name} />
        <Close className={styles.close} onClick={closeDetails} />
      </header>
      <div className={styles.priceContainer}>
        <Shimmer className={styles.label} />
        <Shimmer className={styles.price} />
      </div>
      <div className={styles.addressContainer}>
        <Shimmer className={styles.label} />
        <Shimmer className={styles.address} />
      </div>
    </>
  );
});
