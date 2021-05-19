import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { TransitionMotion, spring } from 'react-motion';

import styles from './index.module.scss';

const SPRING_CONFIG = {
  stiffness: 300,
  damping: 40,
};

export interface Sheet {
  id: string;
  children: React.ReactNode;
}

interface BottomSheetDetails {
  current: Sheet | null;
  register(sheet: Sheet): void;
  setContainer(el: HTMLDivElement | null): void;
  set(id: string | null): void;
  unregister(id: string): void;
}

export const BottomSheetContext = createContext<BottomSheetDetails>({
  current: null,
  register: () => {},
  setContainer: () => {},
  set: () => {},
  unregister: () => {},
});

interface Props {
  children?: React.ReactNode;
}

export function BottomSheetProvider(props: Props) {
  const [current, set] = useState<Sheet | null>(null);
  const container = useRef<HTMLDivElement | null>(null);
  const sheets = useRef(new Map<Sheet['id'], Sheet>());

  return (
    <BottomSheetContext.Provider
      value={{
        current,
        register: sheet => sheets.current.set(sheet.id, sheet),
        setContainer: el => (container.current = el),
        set: id => {
          if (id) {
            const sheet = sheets.current.get(id);

            if (sheet) {
              set(sheet);
            }
          } else {
            set(null);
          }
        },
        unregister: id => sheets.current.delete(id),
      }}
    >
      {props.children}
      <TransitionMotion
        willEnter={() => ({ opacity: 0 })}
        willLeave={() => ({ opacity: spring(0, SPRING_CONFIG) })}
        styles={
          current
            ? [
                {
                  key: 'cover',
                  style: { opacity: spring(100, SPRING_CONFIG) },
                },
              ]
            : []
        }
      >
        {interpolatedStyles => (
          <>
            {interpolatedStyles.map(
              item =>
                container.current &&
                createPortal(
                  <div
                    className={styles.cover}
                    key={item.key}
                    style={{ opacity: item.style.opacity / 100 }}
                  />,
                  container.current,
                ),
            )}
          </>
        )}
      </TransitionMotion>
      <TransitionMotion
        willEnter={() => ({ translateY: 0 })}
        willLeave={() => ({ translateY: spring(0, SPRING_CONFIG) })}
        styles={
          current
            ? [
                {
                  key: current.id,
                  data: current.children,
                  style: { translateY: spring(-100, SPRING_CONFIG) },
                },
              ]
            : []
        }
      >
        {interpolatedStyles => (
          <>
            {interpolatedStyles.map(
              item =>
                container.current &&
                createPortal(
                  <div
                    className={styles.sheet}
                    key={item.key}
                    style={{
                      transform: `translateY(${item.style.translateY}%) translateZ(0)`,
                    }}
                  >
                    {item.data}
                  </div>,
                  container.current,
                ),
            )}
          </>
        )}
      </TransitionMotion>
    </BottomSheetContext.Provider>
  );
}

export function BottomSheetContainer(
  props: React.HTMLAttributes<HTMLDivElement>,
) {
  const { setContainer } = useContext(BottomSheetContext);
  return <div {...props} ref={setContainer} />;
}

export function BottomSheet(props: Sheet) {
  const { register, unregister } = useContext(BottomSheetContext);

  useEffect(() => {
    register(props);
    return () => unregister(props.id);
  }, [props.id]);
  return null;
}
