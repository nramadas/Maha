import {} from 'styled-components';
import { createColors } from '@/lib/theme/createColors';

type Theme = ReturnType<typeof createColors> & {
  font: string;
};

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}
