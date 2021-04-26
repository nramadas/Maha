export interface Email<P> {
  rawText: string;
  subject: string;
  Template: (props: P) => JSX.Element;
}
