import colors from 'colors/safe';

interface Message {
  error?: boolean;
  subject: string;
  text?: string | string[];
}

export function log(message: Message) {
  const type = message.error ? colors.red('ERR') : colors.green(' OK');
  let text = message.text
    ? Array.isArray(message.text)
      ? message.text
      : [message.text]
    : [];

  text = text
    .reduce((acc, t) => {
      acc.push(t.split('\n'));
      return acc;
    }, [] as string[][])
    .flat();

  console.log(`${type} ${message.subject}`);
  text.forEach(t => console.log(`    ${t}`));
}
