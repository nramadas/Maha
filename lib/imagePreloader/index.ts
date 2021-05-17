interface Cache {
  [url: string]: Promise<void>;
}

export const load = (() => {
  const cache: Cache = {};

  return (src: string) => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    } else {
      if (!cache[src]) {
        cache[src] = new Promise(res => {
          const m = new Image();
          m.onload = () => res();
          m.src = src;
        });
      }
      return cache[src];
    }
  };
})();
