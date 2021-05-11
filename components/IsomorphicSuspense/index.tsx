import React, { Suspense } from 'react';

type Props = React.ComponentProps<typeof Suspense>;

export function IsomorphicSuspense(props: Props) {
  if (typeof window === 'undefined') {
    return <>{props.children}</>;
  } else {
    return <Suspense fallback={props.fallback}>{props.children}</Suspense>;
  }
}
