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
  };
}
