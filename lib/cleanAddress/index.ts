export function cleanAddress(addr: string) {
  // we know we're in India, so we can exclude that
  return addr.replaceAll(', India', '');
}
