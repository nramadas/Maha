import React from 'react';
import { Svg, Path, SvgProps } from 'react-native-svg';

export function Book(props: SvgProps) {
  return (
    <Svg viewBox="0 0 48 48" {...props}>
      <Path d="M20 8C21.576 8 22.9972 8.66289 24 9.72506C25.0028 8.66289 26.424 8 28 8H41C42.6569 8 44 9.34315 44 11V37C44 38.6569 42.6569 40 41 40H28C26.424 40 25.0028 39.3371 24 38.2749C22.9972 39.3371 21.576 40 20 40H7C5.34315 40 4 38.6569 4 37V11C4 9.34315 5.34315 8 7 8H20ZM22.5 34.5V13.5C22.5 12.1193 21.3807 11 20 11H7V37H20C21.3807 37 22.5 35.8807 22.5 34.5ZM25.5 13.5V34.5C25.5 35.8807 26.6193 37 28 37H41V11H28C26.6193 11 25.5 12.1193 25.5 13.5Z" />
    </Svg>
  );
}
