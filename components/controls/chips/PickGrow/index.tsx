import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import React from 'react';

import { Add } from '@/components/icons/Add';
import { Close } from '@/components/icons/Close';
import { Caption } from '@/components/typography/Caption';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { i18n } from '@/lib/translate';
import { Text } from '@/models/Text';

import styles from './index.module.scss';

interface Choice {
  disabled?: boolean;
  text: Text;
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
 * component. Only displays what has been selected; additional selections are
 * chosen from a dropdown.
 */
export function PickGrow<C extends Choice>(props: Props<C>) {
  const form = useForm();
  const [Target, Tooltip] = useTooltip({
    alignment: 'center',
    position: 'below',
    positionOffset: 4,
    type: 'click',
  });
  const textToString = useTextToString();

  const { choices, defaultSelected, name, onChoose, ...rest } = props;
  const selected: C[] = form.getValue(name) || defaultSelected || [];
  const remaining: C[] = choices.filter(choice => {
    return isNil(selected.find(c => isEqual(c, choice)));
  });

  return (
    <div className={styles.container}>
      {selected.map(choice => (
        <label
          className={cx(styles.label, {
            [styles.disabled]: !!choice.disabled,
          })}
          key={textToString(choice.text)}
        >
          <input
            {...rest}
            checked
            readOnly
            className={styles.hidden}
            disabled={choice.disabled}
            name={name}
            type="checkbox"
            value={textToString(choice.text)}
          />
          <div className={styles.choice}>
            <div
              className={styles.iconCircle}
              onClick={() => {
                if (choice.disabled) {
                  return;
                }

                const withoutChoice = selected.filter(s => !isEqual(s, choice));
                form.setValue(name, withoutChoice);
                onChoose?.(withoutChoice);
              }}
            >
              <Close className={styles.close} />
            </div>
            <Caption>{textToString(choice.text)}</Caption>
          </div>
        </label>
      ))}
      {!!remaining.length && (
        <>
          <Target>
            <label className={styles.addChoice}>
              <div className={styles.choice}>
                <div className={styles.iconCircle}>
                  <Add className={styles.add} />
                </div>
                <Caption>
                  <i18n.Translate>Add</i18n.Translate>
                </Caption>
              </div>
            </label>
          </Target>
          <Tooltip>
            <div className={styles.remainingChoices}>
              {remaining.map(choice => (
                <div
                  key={textToString(choice.text)}
                  className={styles.remainingChoice}
                  onClick={() => {
                    const newSelected = selected.concat(choice);
                    form.setValue(name, newSelected);
                    onChoose?.(newSelected);
                  }}
                >
                  <Caption>{textToString(choice.text)}</Caption>
                </div>
              ))}
            </div>
          </Tooltip>
        </>
      )}
    </div>
  );
}
