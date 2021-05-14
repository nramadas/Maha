import React from 'react';

import { Metropolitan } from '@/components/explore/Metropolitan';
import { fromMetropolitanSubRouteText } from '@/lib/route';
import { MetropolitanKey } from '@/models/MetropolitanKey';

interface Props {
  query: {
    metropolitan: string;
  };
}

export default function Explore(props: Props) {
  const { metropolitan } = props.query;
  const key = fromMetropolitanSubRouteText(metropolitan);

  if (!key || !Object.values(MetropolitanKey).includes(key)) {
    return <div />;
  }

  return <Metropolitan metropolitanKey={key} />;
}
