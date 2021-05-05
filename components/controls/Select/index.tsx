import cx from 'classnames';
import React, { useEffect, useState } from 'react';

import { ChevronDown } from '@/components/icons/ChevronDown';
import { Body2 } from '@/components/typography';
import { useForm } from '@/hooks/useForm';
import { useTextToString } from '@/hooks/useTextToString';
import { useTooltip } from '@/hooks/useTooltip';
import { Text } from '@/models/Text';

import styles from './index.module.scss';
import { sortOptions } from './sortOptions';

interface Option {
  text: Text;
}

interface Props<O> {
  /**
   * Render method for each option in the select. Has the signature
   * `<O extends Option>(option: O) => JSX.Element`
   */
  children: (option: O & { text: string }) => JSX.Element;
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
  placeholder?: Text;
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
  const form = useForm();
  const textToString = useTextToString();
  const [selected, setSelected] = useState<O | null>(
    props.defaultSelected || (props.placeholder ? null : props.options[0]),
  );

  useEffect(() => {
    form.setValue(props.name, selected);
  }, [selected]);

  const [Target, Tooltip] = useTooltip({
    alignment: 'full',
    position: 'below',
    positionOffset: -1,
    preventTooltipClickPropagation: false,
    type: 'click',
  });

  const sortedOptions = sortOptions(props.options, textToString, selected);

  const render = (option: O) =>
    props.children({ ...option, text: textToString(option.text) });

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
              <div>{render(selected)}</div>
            ) : props.placeholder ? (
              <Body2>{textToString(props.placeholder)}</Body2>
            ) : (
              <div>{render(props.options[0])}</div>
            )}
            <ChevronDown className={styles.icon} />
          </div>
          {props.placeholder && !props.defaultSelected && (
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
              className={cx(styles.option, styles.size)}
              key={textToString(option.text)}
              onClick={() => {
                setSelected(option);
                props.onChange?.(option);
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
