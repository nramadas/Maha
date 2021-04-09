export interface Props {
  disabled?: boolean;
  view: Date;
  onChange(date: Date): void;
}
