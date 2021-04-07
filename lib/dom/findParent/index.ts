/**
 * For a given element, check to see if that element or any of its acestors
 * fulfill the search method. Returns either the matching ancestor or null.
 */
export function findParent(
  el: HTMLElement,
  search: (el: HTMLElement) => boolean,
): HTMLElement | null {
  let current: HTMLElement | null = el;
  while (current && !search(current)) {
    current = current.parentElement;
  }
  return current;
}
