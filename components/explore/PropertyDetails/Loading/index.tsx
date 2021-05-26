import React, { memo } from 'react';

import { Close } from '@/components/icons/Close';
import { Shimmer } from '@/components/loading/Shimmer';
import { useBottomSheet } from '@/hooks/useBottomSheet';
import { useSelectedProperty } from '@/hooks/useExplorePage';

import styles from './index.module.scss';

interface Props {
  propertyId: string;
}

export const Loading = memo(function Loading(props: Props) {
  const [, closeDetails] = useBottomSheet(props.propertyId);
  const { setSelectedProperty } = useSelectedProperty();

  return (
    <>
      <header className={styles.header}>
        <Shimmer className={styles.name} />
        <Close
          className={styles.close}
          onClick={() => {
            closeDetails();
            setSelectedProperty(null);
          }}
        />
      </header>
      <div className={styles.priceContainer}>
        <Shimmer className={styles.price} />
      </div>
      <Shimmer className={styles.media} />
      <div className={styles.infoContainer}>
        <Shimmer className={styles.label} />
        <Shimmer className={styles.info} />
      </div>
      <div className={styles.infoContainer}>
        <Shimmer className={styles.label} />
        <Shimmer className={styles.info} />
      </div>
    </>
  );
});
