import cx from 'classnames';
import React from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';

import styles from './index.module.scss';

interface Props {
  className?: string;
  hovered?: boolean;
  property: MapPropertyModel;
  onClick?(): void;
  onHoverChange?(hovered: boolean): void;
}

export function PropertyListItem(props: Props) {
  return (
    <div
      className={cx(styles.container, props.className, {
        [styles.hovered]: !!props.hovered,
      })}
      onClick={() => props.onClick?.()}
      onMouseEnter={() => props.onHoverChange?.(true)}
      onMouseLeave={() => props.onHoverChange?.(false)}
    />
  );
}
