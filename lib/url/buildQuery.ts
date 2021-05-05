import isNil from 'lodash/isNil';

interface Params {
  [param: string]: string | undefined | null;
}

export function buildQuery(params: Params) {
  const parts = Object.entries(params)
    .map(([k, v]) => {
      if (!isNil(v)) {
        return `${k}=${encodeURIComponent(v)}`;
      }
    })
    .filter(Boolean);

  return '?' + parts.join('&');
}
