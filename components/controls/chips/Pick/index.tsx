import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import React from 'react';

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
   * Choices that are selected by default
   */
  defaultSelected?: C[];
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
  const { choices, defaultSelected, name, onChoose, ...rest } = props;
  const form = useForm();
  const selected: C[] = form.getValue(name) || defaultSelected || [];

  return (
    <div className={styles.container}>
      {choices.map(choice => {
        const isSelected = !isNil(selected.find(s => isEqual(s, choice)));

        return (
          <label
            className={cx(styles.label, {
              [styles.disabled]: !!choice.disabled,
            })}
            key={choice.text}
          >
            <input
              {...rest}
              checked={isSelected}
              className={styles.hidden}
              disabled={choice.disabled}
              name={name}
              type="checkbox"
              value={choice.text}
              onChange={() => {
                if (choice.disabled) {
                  return;
                }

                const withoutChoice = selected.filter(s => !isEqual(s, choice));
                const newSelected =
                  withoutChoice.length === selected.length
                    ? withoutChoice.concat(choice)
                    : withoutChoice;

                form.setValue(name, newSelected);
                onChoose?.(newSelected);
              }}
            />
            <div className={styles.choice}>
              <div className={styles.checkCircle}>
                <Checkmark className={styles.check} />
              </div>
              <Caption>{choice.text}</Caption>
            </div>
          </label>
        );
      })}
    </div>
  );
}
