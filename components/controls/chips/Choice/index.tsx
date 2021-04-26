import cx from 'classnames';
import React from 'react';

import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';

import styles from './index.module.scss';

interface ChoiceObj {
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
  onChoose?: (choice: C) => void;
}

/**
 * Chips componet that allows for a single choice. Behaves like a radio button
 */
export function Choice<C extends ChoiceObj>(props: Props<C>) {
  const { choices, onChoose, ...rest } = props;
  const form = useForm();

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
            type="radio"
            onInput={() => {
              form.setValue(rest.name, choice);
              onChoose?.(choice);
            }}
          />
          <div className={styles.choice}>
            <Caption>{choice.text}</Caption>
          </div>
        </label>
      ))}
    </div>
  );
}
