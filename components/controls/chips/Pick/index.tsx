import cx from 'classnames';
import React, { useRef } from 'react';

import { Checkmark } from '@/components/icons/Checkmark';
import { Caption } from '@/components/typography/Caption';

import styles from './index.module.scss';

interface Choice {
  disabled?: boolean;
  text: string;
}

interface Props<C> extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A list of choices to select from
   */
  choices: C[];
  /**
   * Reference name for chips value
   */
  name: string;
  /**
   * Callback that returns when an item is selected
   */
  onChoose?: (choices: O[]) => void;
}

/**
 * Chips componet that allows for multiple choices. Behaves like a checkbox
 * component.
 */
export function Pick<C extends Choice>(props: Props<C>) {
  const { choices, onChoose, ...rest } = props;
  const selected = useRef(new Set<C>());

  return (
    <div className={styles.container}>
      {choices.map(choice => (
        <label
          className={cx(styles.label, {
            [styles.disabled]: !!choice.disabled,
          })}
          key={choice.text}
        >
          <input
            {...rest}
            className={styles.hidden}
            disabled={choice.disabled}
            type="checkbox"
            onChange={e => {
              if (!onChoose) {
                return;
              }

              if (e.currentTarget.checked) {
                selected.current.add(choice);
              } else {
                selected.current.delete(choice);
              }

              onChoose(Array.from(selected.current.values()));
            }}
          />
          <div className={styles.choice}>
            <div className={styles.checkCircle}>
              <Checkmark className={styles.check} />
            </div>
            <Caption>{choice.text}</Caption>
          </div>
        </label>
      ))}
    </div>
  );
}
