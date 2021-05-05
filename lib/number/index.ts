export function makePretty(str: string) {
  const newNum: string[] = [];

  str
    .split('')
    .reverse()
    .forEach((char, i) => {
      if (i < 3) {
        newNum.push(char);
      } else if ((i - 1) % 2 === 0) {
        newNum.push(',');
        newNum.push(char);
      } else {
        newNum.push(char);
      }
    });

  return newNum.reverse().join('');
}

export function toString(num: number) {
  return makePretty(num.toString());
}

export function fromString(num: string) {
  const withoutCommas = num.replaceAll(',', '');
  const value = parseInt(withoutCommas, 10);
  return Number.isNaN(value) ? null : value;
}
