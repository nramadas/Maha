import cx from 'classnames';
import React, { useRef } from 'react';

import { Checkmark } from '@/components/icons/Checkmark';
import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';

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
  onChoose?: (choices: C[]) => void;
}

/**
 * Chips componet that allows for multiple choices. Behaves like a checkbox
 * component.
 */
export function Pick<C extends Choice>(props: Props<C>) {
  const { choices, onChoose, ...rest } = props;
  const form = useForm();
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
            value={choice.text}
            onChange={e => {
              if (e.currentTarget.checked) {
                selected.current.add(choice);
              } else {
                selected.current.delete(choice);
              }

              const selectedItems = Array.from(selected.current.values());
              form.setValue(rest.name, selectedItems);
              onChoose?.(selectedItems);
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
