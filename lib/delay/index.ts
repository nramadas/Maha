export const wait = (delay: number) =>
  new Promise(res => {
    setTimeout(res, delay);
  });

export const waitAtLeast = (delay: number, cb: Function) =>
  Promise.all([wait(delay), cb()]);
