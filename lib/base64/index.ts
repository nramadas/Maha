export function decode(a: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(a, 'base64').toString('binary');
  } else {
    return window.atob(a);
  }
}

export function encode(b: string) {
  if (typeof window === 'undefined') {
    return Buffer.from(b).toString('base64');
  } else {
    return window.btoa(b);
  }
}
