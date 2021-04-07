import React from 'react';
import { createPortal } from 'react-dom';

import { TooltipContext } from '@/contexts/Tooltip';

import styles from './index.module.scss';

export interface Config {
  /**
   * Where the Tooltip should appear (horizontally) relative to the Target.
   * Values are one of `'left'`, `'right'`, `'center'`, `'full'`.
   * The `'full'` option indicates that the Tooltip's width should match the
   * width of the Target, with the Tooltip's left and right edges aligning
   * with the Target's left and right edges.
   */
  alignment: 'left' | 'right' | 'center' | 'full';
  /**
   * Whether clicking on items inside the tooltip should prevent the tooltip
   * from closing.
   */
  preventTooltipClickPropagation?: boolean;
  /**
   * Optional, returns the container that this specific Tooltip should render
   * in. If not specified, the Tooltip will render in the container specified
   * by the Provider established by the tooltip context.
   * Signature: `() => Element | null`
   */
  getContainer?: () => Element | null;
  /**
   * Where the Tooltip should appear (vertically) relative to the Target.
   * Values are one of `'above'`, `'below'`.
   */
  position: 'above' | 'below';
  /**
   * In pixels, indicates the vertical distance separating the Target and the
   * Tooltip.
   */
  positionOffset: number;
  /**
   * How the tooltip should be triggered.
   * Values are one of `'click'`, `'hover'`, `'focus'`.
   */
  type: 'click' | 'hover' | 'focus';
}

const DEFAULT_CONFIG: Config = {
  alignment: 'center',
  position: 'above',
  positionOffset: 0,
  type: 'click',
};

function getConfig(config?: Partial<Config>) {
  return {
    ...DEFAULT_CONFIG,
    ...(config || {}),
  };
}

interface Props {
  children: React.ReactElement;
}

interface InnerProps extends Props {
  id: symbol;
  config: Config;
}

function Target(props: InnerProps) {
  const { current, set } = React.useContext(TooltipContext);
  const { id, config, children: child } = props;

  return React.cloneElement(React.Children.only(child), {
    'data-tooltipopen': current === id,
    onBlur:
      config.type === 'focus'
        ? (e: React.FocusEvent<HTMLElement>) => {
            set({
              current: undefined,
              target: undefined,
            });

            child.props.onBlur && child.props.onBlur(e);
          }
        : child.props.onBlur,
    onClick:
      config.type === 'click'
        ? (e: React.MouseEvent<HTMLElement>) => {
            set(
              id === current
                ? {
                    current: undefined,
                    target: undefined,
                  }
                : {
                    current: id,
                    target: e.currentTarget,
                  },
            );

            child.props.onClick && child.props.onClick(e);
          }
        : child.props.onClick,
    onFocus:
      config.type === 'focus'
        ? (e: React.FocusEvent<HTMLElement>) => {
            set({
              current: id,
              target: e.currentTarget,
            });

            child.props.onFocus && child.props.onFocus(e);
          }
        : child.props.onFocus,
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      if (config.type === 'hover') {
        set({
          current: id,
          target: e.currentTarget,
        });
      }

      child.props.onMouseEnter && child.props.onMouseEnter(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      if (config.type === 'hover') {
        set({
          current: undefined,
          target: undefined,
        });
      }

      child.props.onMouseLeave && child.props.onMouseLeave(e);
    },
  });
}

function Tooltip(props: InnerProps) {
  const { current, target } = React.useContext(TooltipContext);
  const { getContainer } = React.useContext(TooltipContext);
  const { id, config, children: child } = props;
  const container = (config.getContainer || getContainer)();

  if (target && container && id === current) {
    return createPortal(
      <div
        className={styles.tooltip}
        ref={tooltip => {
          if (tooltip) {
            const targetBox = target.getBoundingClientRect();
            const tooltipBox = tooltip.getBoundingClientRect();

            let top: number = window.scrollY;
            let left: number = window.scrollX;

            switch (config.alignment) {
              case 'center': {
                left =
                  left +
                  targetBox.left -
                  (tooltipBox.width - targetBox.width) / 2;
                break;
              }
              case 'left': {
                left = left + targetBox.left;
                break;
              }
              case 'right': {
                left = left + targetBox.right - tooltipBox.width;
                break;
              }
              case 'full': {
                left = left + targetBox.left;
                tooltip.style.width = `${targetBox.width}px`;
                break;
              }
            }

            switch (config.position) {
              case 'above': {
                top =
                  top +
                  targetBox.top -
                  tooltipBox.height -
                  config.positionOffset;
                break;
              }
              case 'below': {
                top = top + targetBox.bottom + config.positionOffset;
                break;
              }
            }

            tooltip.style.top = `${top}px`;
            tooltip.style.left = `${left}px`;
          }
        }}
        onClick={e =>
          config.preventTooltipClickPropagation !== false &&
          e.nativeEvent.stopImmediatePropagation()
        }
      >
        {child}
      </div>,
      container,
    );
  }

  return null;
}

export function useTooltip(options?: Partial<Config>) {
  const id = React.useRef(Symbol());
  const config = getConfig(options);

  const target = React.useRef((props: Props) => (
    <Target id={id.current} config={config} {...props} />
  ));

  const tooltip = React.useRef((props: Props) => (
    <Tooltip id={id.current} config={config} {...props} />
  ));

  return [target.current, tooltip.current];
}
