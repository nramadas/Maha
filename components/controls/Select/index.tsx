import cx from 'classnames';
import isEqual from 'lodash/isEqual';
import React, { useEffect } from 'react';

import { ChevronDown } from '@/components/icons/ChevronDown';
import { Close } from '@/components/icons/Close';
import { Body2 } from '@/components/typography';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { Text } from '@/models/Text';

import styles from './index.module.scss';
import { sortOptions } from './sortOptions';

interface Option<V, E> {
  disabled?: boolean;
  text: Text;
  value: V;
  extraData?: E;
}

interface Props<V, E> {
  /**
   * Render method for each option in the select. Has the signature
   * `<O extends Option>(option: O) => JSX.Element`
   */
  children: (option: Option<V, E> & { text: string }) => JSX.Element;
  /**
   * Input name
   */
  name: string;
  /**
   * List of options to display in the select. Each option extends the shape
   * `{ text: string }`.
   */
  options: Option<V, E>[];
  /**
   * If there are no options seleced, placeholder text to display.
   */
  placeholder?: Text;
  /**
   * Callback, fired when a new option is selected. Has the signature
   * `<O extends Option>(option: O) => void`
   */
  onChange?: (option: Option<V, E> | null) => void;
}

/**
 * Select component, extends standard `<input/>` props.
 */
export function Select<V, E = any>(props: Props<V, E>) {
  const form = useForm();
  const textToString = useTextToString();
  const preSort = sortOptions(props.options, textToString, null);

  const _selected =
    form.getValue(props.name) || (props.placeholder ? null : preSort[0]);

  const selected = props.options.find(o => isEqual(o.value, _selected?.value));

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    positionOffset: -1,
    preventTooltipClickPropagation: false,
    type: 'click',
  });

  const sortedOptions = sortOptions(props.options, textToString, selected);

  const render = (option: Option<V, E>) =>
    props.children({ ...option, text: textToString(option.text) });

  useEffect(() => {
    if (selected) {
      form.setValue(props.name, selected);
    }
  }, []);

  return (
    <div>
      <input
        name={props.name}
        type="hidden"
        value={selected ? textToString(selected.text) : ''}
      />
      <Target>
        <div
          className={cx(styles.value, {
            [styles.placeholder]: !selected && !!props.placeholder,
          })}
        >
          <div className={cx(styles.size, styles.sizeValue)}>
            {selected ? (
              <div className={styles.textOverflow}>{render(selected)}</div>
            ) : props.placeholder ? (
              <Body2>{textToString(props.placeholder)}</Body2>
            ) : (
              <div>{render(props.options[0])}</div>
            )}
            {selected && props.placeholder ? (
              <Close
                className={styles.close}
                onClick={e => {
                  e.stopPropagation();
                  form.setValue(props.name, null);
                  props.onChange?.(null);
                }}
              />
            ) : (
              <ChevronDown className={styles.icon} />
            )}
          </div>
          {props.placeholder && (
            <div className={styles.size}>
              <Body2>{textToString(props.placeholder)}</Body2>
              <ChevronDown className={styles.icon} />
            </div>
          )}
          {props.options.map(option => (
            <div className={styles.size} key={textToString(option.text)}>
              <div>{render(option)}</div>
              <ChevronDown className={styles.icon} />
            </div>
          ))}
        </div>
      </Target>
      <Tooltip>
        <div className={styles.optionsList}>
          {sortedOptions.map(option => (
            <div
              className={cx(styles.option, styles.size, {
                [styles.disabled]: !!option.disabled,
              })}
              key={textToString(option.text)}
              onClick={() => {
                if (!option.disabled) {
                  form.setValue(props.name, option);
                  props.onChange?.(option);
                }
              }}
            >
              {render(option)}
            </div>
          ))}
        </div>
      </Tooltip>
    </div>
  );
}
