import React from 'react';

interface Props {
  query: {
    slug: [string, string];
  };
}

export default function Organization(props: Props) {
  const [orgId, orgName] = props.query.slug;
  console.log(orgId, orgName);
  return <div />;
}
