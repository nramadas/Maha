import {
  minifyIntrospectionQuery,
  getIntrospectedSchema,
} from '@urql/introspection';
import { getIntrospectionQuery } from 'graphql';

export function introspect() {
  return fetch(process.env.NEXT_PUBLIC_GQL_ADDRESS!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      variables: {},
      query: getIntrospectionQuery({ descriptions: false }),
    }),
  })
    .then(r => r.json())
    .then(({ data }) =>
      data ? minifyIntrospectionQuery(getIntrospectedSchema(data)) : null,
    );
}
