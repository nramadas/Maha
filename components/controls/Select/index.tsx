import cx from 'classnames';
import React, { useState } from 'react';

import { ChevronDown } from '@/components/icons/ChevronDown';
import { Body1 } from '@/components/typography';
import { useTooltip } from '@/hooks/useTooltip';

import styles from './index.module.scss';
import { sortOptions } from './sortOptions';

interface Option {
  text: string;
}

interface Props<O>
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  /**
   * Render method for each option in the select. Has the signature
   * `<O extends Option>(option: O) => JSX.Element`
   */
  children: (option: O) => JSX.Element;
  /**
   * Whether the select should come pre-selected with an option.
   */
  defaultSelected?: O;
  /**
   * Input name
   */
  name: string;
  /**
   * List of options to display in the select. Each option extends the shape
   * `{ text: string }`.
   */
  options: O[];
  /**
   * If there are no options seleced, placeholder text to display.
   */
  placeholder?: string;
  /**
   * Callback, fired when a new option is selected. Has the signature
   * `<O extends Option>(option: O) => void`
   */
  onChange?: (option: O) => void;
}

/**
 * Select component, extends standard `<input/>` props.
 */
export function Select<O extends Option>(props: Props<O>) {
  const [selected, setSelected] = useState<O | null>(
    props.defaultSelected || (props.placeholder ? null : props.options[0]),
  );

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    positionOffset: -1,
    preventTooltipClickPropagation: false,
    type: 'click',
  });

  const sortedOptions = sortOptions(props.options, selected);

  return (
    <div>
      <input name={props.name} type="hidden" value={selected?.text} />
      <Target>
        <button
          className={cx(styles.value, {
            [styles.placeholder]: !selected && !!props.placeholder,
          })}
        >
          <div className={cx(styles.size, styles.sizeValue)}>
            {selected ? (
              <div>{props.children(selected)}</div>
            ) : props.placeholder ? (
              <Body1>{props.placeholder}</Body1>
            ) : (
              <div>{props.children(props.options[0])}</div>
            )}
            <ChevronDown className={styles.icon} />
          </div>
          {props.placeholder && !props.defaultSelected && (
            <div className={styles.size}>
              <Body1>{props.placeholder}</Body1>
              <ChevronDown className={styles.icon} />
            </div>
          )}
          {props.options.map(option => (
            <div className={styles.size} key={option.text}>
              <div>{props.children(option)}</div>
              <ChevronDown className={styles.icon} />
            </div>
          ))}
        </button>
      </Target>
      <Tooltip>
        <div className={styles.optionsList}>
          {sortedOptions.map(option => (
            <button
              className={cx(styles.option, styles.size)}
              key={option.text}
              onClick={() => {
                setSelected(option);
                props.onChange?.(option);
              }}
            >
              {props.children(option)}
            </button>
          ))}
        </div>
      </Tooltip>
    </div>
  );
}
