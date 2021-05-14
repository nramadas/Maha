import trimEnd from 'lodash/trimEnd';
import trimStart from 'lodash/trimStart';

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

function formatDecimal(num: number) {
  const str = num.toFixed(2);
  const withoutLeadingZero = trimStart(str, '0');
  const withoutTrailingZero = trimEnd(withoutLeadingZero, '0');
  return withoutTrailingZero;
}

export function toString(num: number) {
  const integer = Math.floor(num);
  const fractional = num - integer;
  const str = makePretty(integer.toString());
  const decimal = fractional ? formatDecimal(fractional) : '';
  return `${str}${decimal}`;
}

export function fromString(num: string, float?: boolean) {
  const withoutCommas = num.replaceAll(',', '');
  const value = float ? parseFloat(withoutCommas) : parseInt(withoutCommas, 10);
  return Number.isNaN(value) ? null : value;
}
