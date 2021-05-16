import React from 'react';

import { Logo } from '@/components/Logo';
import { DomContainerProvider } from '@/contexts/DomContainer';

import styles from './index.module.scss';

const LEFT_PANE_ID = Symbol.for('EXPLORE_LEFT_PANE');
const CENTER_PANE_ID = Symbol.for('EXPLORE_CENTER_PANE');
const RIGHT_PANE_ID = Symbol.for('EXPLORE_RIGHT_PANE');

interface LeftPaneProps {
  id?: typeof LEFT_PANE_ID;
  children: JSX.Element;
}

interface CenterPaneProps {
  id?: typeof CENTER_PANE_ID;
  children: JSX.Element;
}

interface RightPaneProps {
  id?: typeof RIGHT_PANE_ID;
  children: JSX.Element;
}

export function LeftPane(props: LeftPaneProps) {
  return props.children;
}

export function CenterPane(props: CenterPaneProps) {
  return props.children;
}

export function RightPane(props: RightPaneProps) {
  return props.children;
}

LeftPane.defaultProps = {
  id: LEFT_PANE_ID,
};

CenterPane.defaultProps = {
  id: CENTER_PANE_ID,
};

RightPane.defaultProps = {
  id: RIGHT_PANE_ID,
};

type PaneProps =
  | React.ComponentProps<typeof LeftPane>
  | React.ComponentProps<typeof CenterPane>
  | React.ComponentProps<typeof RightPane>;

interface Props {
  children?: React.ReactElement<PaneProps>[];
}

export function Explore(props: Props) {
  const leftPane = props.children?.find(
    child => child.props.id === LEFT_PANE_ID,
  );

  const centerPane = props.children?.find(
    child => child.props.id === CENTER_PANE_ID,
  );

  const rightPane = props.children?.find(
    child => child.props.id === RIGHT_PANE_ID,
  );

  return (
    <div className={styles.container}>
      <nav className={styles.leftRail}>
        <DomContainerProvider>
          <div className={styles.leftRailContent}>
            <Logo />
          </div>
        </DomContainerProvider>
      </nav>
      <div className={styles.leftPane}>{leftPane}</div>
      <div className={styles.centerPane}>{centerPane}</div>
      <div className={styles.rightPane}>
        <DomContainerProvider>{rightPane}</DomContainerProvider>
      </div>
    </div>
  );
}
