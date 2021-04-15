import { mix } from 'polished';

enum Color {
  ERROR = '#b00020',
  G050 = '#FAFAFA',
  G100 = '#F5F5F5',
  G200 = '#EEEEEE',
  G300 = '#E0E0E0',
  G400 = '#BDBDBD',
  G500 = '#9E9E9E',
  G600 = '#757575',
  G700 = '#616161',
  G800 = '#424242',
  G900 = '#212121',
  G950 = '#1a1a1a',
}

export function createColors() {
  const primary = Color.G700;
  // const primary = '#6C62A3';

  return {
    background: Color.G950,
    disabled: Color.G900,
    error: Color.ERROR,
    fieldError: mix(0.16, Color.ERROR, Color.G950),
    field: mix(0.03, Color.G050, Color.G950),
    fieldBorder: mix(0.07, Color.G050, Color.G950),
    fieldFocused: mix(0.05, Color.G050, Color.G950),
    fieldHovered: mix(0.05, Color.G050, Color.G950),
    metadata: mix(0.5, Color.G950, Color.G050),
    onBackground: Color.G050,
    onDisabled: Color.G800,
    onError: Color.G050,
    onPrimary: Color.G050,
    primaryDragged: mix(0.16, Color.G050, primary),
    primaryFaded: mix(0.5, Color.G950, primary),
    primaryFocused: mix(0.24, Color.G050, primary),
    primaryHovered: mix(0.08, Color.G050, primary),
    primaryPressed: mix(0.2, Color.G050, primary),
    primary,
  };
}
