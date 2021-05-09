import { mix, rgba } from 'polished';

enum Color {
  ERROR = '#b00020',
  G950 = '#FAFAFA',
  G900 = '#F5F5F5',
  G800 = '#EEEEEE',
  G700 = '#E0E0E0',
  G600 = '#BDBDBD',
  G500 = '#9E9E9E',
  G400 = '#757575',
  G300 = '#616161',
  G200 = '#424242',
  G100 = '#212121',
  G050 = '#1a1a1a',
  G000 = '#000000',
}

export function createColors() {
  const primary = '#FFA000';

  return {
    background: Color.G950,
    disabled: Color.G700,
    error: Color.ERROR,
    fieldError: mix(0.16, Color.ERROR, Color.G950),
    field: mix(0.03, Color.G000, Color.G950),
    fieldBorder: mix(0.07, Color.G050, Color.G950),
    fieldFocused: mix(0.05, Color.G000, Color.G950),
    fieldHovered: mix(0.05, Color.G000, Color.G950),
    metadata: mix(0.5, Color.G950, Color.G050),
    navBackground: '#263238',
    navBackgroundTransparent: rgba('#263238', 0.8),
    navBorderDark: rgba(0, 0, 0, 0.1),
    navBorderLight: rgba(255, 255, 255, 0.07),
    onBackground: Color.G050,
    onDisabled: Color.G600,
    onError: Color.G050,
    onPrimary: Color.G950,
    primaryDragged: mix(0.16, Color.G000, primary),
    primaryFaded: mix(0.5, Color.G950, primary),
    primaryFocused: mix(0.1, Color.G000, primary),
    primaryHovered: mix(0.08, Color.G000, primary),
    primaryPressed: mix(0.2, Color.G000, primary),
    primary,
    warning: '#FFEB3B',
    success: '#4CAF50',
  };
}
