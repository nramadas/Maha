import { createColors } from '@/lib/theme/createColors';

type Colors = ReturnType<typeof createColors>;
type ColorName = keyof Colors;
export type CssColorVar = `--color-${ColorName}`;

export function createCssVars() {
  const colors = createColors();
  const cssColors = Object.entries(colors).reduce((acc, [name, value]) => {
    acc[`--color-${name}` as CssColorVar] = value;
    return acc;
  }, {} as { [key in CssColorVar]: string });

  return {
    ...cssColors,
    '--font-body':
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    '--font-logo': "'Fascinate', cursive",
    '--font-title': "'Oswald', sans-serif",
    '--z-header': 11,
    '--z-dialog': 90,
    '--z-tooltip': 100,
    '--elevation-0': 'none',
    '--elevation-1':
      '0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.20)',
    '--elevation-2':
      '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.20)',
    '--elevation-3':
      '0 3px 4px 0 rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12), 0 1px 8px 0 rgba(0,0,0,0.20)',
    '--elevation-4':
      '0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.20)',
    '--elevation-5':
      '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20)',
    '--elevation-6':
      '0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.20)',
    '--elevation-7':
      '0 9px 12px 1px rgba(0,0,0,0.14), 0 3px 16px 2px rgba(0,0,0,0.12), 0 5px 6px -3px rgba(0,0,0,0.20)',
    '--elevation-8':
      '0 12px 17px 2px rgba(0,0,0,0.14), 0 5px 22px 4px rgba(0,0,0,0.12), 0 7px 8px -4px rgba(0,0,0,0.20)',
    '--elevation-9':
      '0 16px 24px 2px rgba(0,0,0,0.14), 0 6px 30px 5px rgba(0,0,0,0.12), 0 8px 10px -5px rgba(0,0,0,0.20)',
    '--elevation-10':
      '0 24px 38px 3px rgba(0,0,0,0.14), 0 9px 46px 8px rgba(0,0,0,0.12), 0 11px 15px -7px rgba(0,0,0,0.20)',
  };
}
