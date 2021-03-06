interface Variables {
  [key: string]: any;
}

interface Args {
  variables?: Variables;
}

export function createRequest(strings: TemplateStringsArray) {
  const query = strings[0];

  return (args: Args = {}) => {
    const { variables = {} } = args;

    return fetch(process.env.NEXT_PUBLIC_GQL_ADDRESS!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
        operationName: null,
      }),
    }).then(res => res.json());
  };
}
