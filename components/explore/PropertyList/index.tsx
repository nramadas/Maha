import React from 'react';

import { MapPropertyModel } from '@/components/explore/MapPropertyModel';
import { PropertyListItem } from '@/components/explore/PropertyListItem';

import styles from './index.module.scss';

interface Props {
  className?: string;
  hovered?: MapPropertyModel | null;
  properties: MapPropertyModel[];
  onHoverChange?(hoveredId: MapPropertyModel | null): void;
  onSelectProperty?(property: MapPropertyModel): void;
}

export function PropertyList(props: Props) {
  return (
    <div className={styles.container}>
      {props.properties.map(property => (
        <PropertyListItem
          className={styles.property}
          hovered={props.hovered?.id === property.id}
          key={property.id}
          property={property}
          onClick={() => props.onSelectProperty?.(property)}
          onHoverChange={h => {
            if (h) {
              props.onHoverChange?.(property);
            } else if (props.hovered?.id === property.id) {
              props.onHoverChange?.(null);
            }
          }}
        />
      ))}
    </div>
  );
}
