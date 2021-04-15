export interface Email<P> {
  rawText: string;
  subject: string;
  template: (props: P) => JSX.Element;
}
