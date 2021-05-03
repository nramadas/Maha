interface Params {
  [param: string]: string;
}

export function buildQuery(params: Params) {
  const parts = Object.entries(params).map(([k, v]) => {
    return `${k}=${encodeURIComponent(v)}`;
  });

  return '?' + parts.join('&');
}
