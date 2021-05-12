import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import React from 'react';

import { Checkmark } from '@/components/icons/Checkmark';
import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface Choice<V, E> {
  disabled?: boolean;
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A list of choices to select from
   */
  choices: Choice<V, E>[];
  /**
   * Reference name for chips value
   */
  name: string;
  /**
   * Callback that returns when an item is selected
   */
  onChoose?: (choices: Choice<V, E>[]) => void;
}

/**
 * Chips componet that allows for multiple choices. Behaves like a checkbox
 * component.
 */
export function Pick<V, E = any>(props: Props<V, E>) {
  const { choices, name, onChoose, ...rest } = props;

  const form = useForm();
  const textToString = useTextToString();

  const selected: Choice<V, E>[] = form.getValue(name) || [];

  return (
    <div className={styles.container}>
      {choices.map(choice => {
        const isSelected = !isNil(
          selected.find(s => isEqual(s.value, choice.value)),
        );

        return (
          <label
            className={cx(styles.label, {
              [styles.disabled]: !!choice.disabled,
            })}
            key={textToString(choice.text)}
          >
            <input
              {...rest}
              checked={isSelected}
              className={styles.hidden}
              disabled={choice.disabled}
              name={name}
              type="checkbox"
              value={textToString(choice.text)}
              onChange={() => {
                if (choice.disabled) {
                  return;
                }

                const withoutChoice = selected.filter(
                  s => !isEqual(s.value, choice.value),
                );
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
              <Caption>{textToString(choice.text)}</Caption>
            </div>
          </label>
        );
      })}
    </div>
  );
}
