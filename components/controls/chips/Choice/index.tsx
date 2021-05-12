import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import React from 'react';

import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface ChoiceObj<V, E> {
  disabled?: boolean;
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * A list of choices to select from
   */
  choices: ChoiceObj<V, E>[];
  /**
   * Reference name for chips value
   */
  name: string;
  /**
   * Callback that returns when an item is selected
   */
  onChoose?: (choice: ChoiceObj<V, E>) => void;
}

/**
 * Chips componet that allows for a single choice. Behaves like a radio button
 */
export function Choice<V, E = any>(props: Props<V, E>) {
  const { name, choices, onChoose, ...rest } = props;
  const form = useForm();
  const textToString = useTextToString();
  const selected = form.getValue(name);

  return (
    <div className={styles.container}>
      {choices.map(choice => (
        <label
          className={cx(styles.label, {
            [styles.disabled]: !!choice.disabled,
          })}
          key={textToString(choice.text)}
        >
          <input
            {...rest}
            className={styles.hidden}
            checked={isEqual(selected?.value, choice.value)}
            disabled={choice.disabled}
            type="radio"
            onChange={() => {
              form.setValue(name, choice);
              onChoose?.(choice);
            }}
          />
          <div className={styles.choice}>
            <Caption>{textToString(choice.text)}</Caption>
          </div>
        </label>
      ))}
    </div>
  );
}
