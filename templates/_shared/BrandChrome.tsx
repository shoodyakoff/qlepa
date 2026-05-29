import { tokens } from "../../brand/tokens";

type BrandChromeProps = {
  className?: string;
};

export function brandSignature(): string {
  return `тгк ${tokens.brand.handle}`;
}

export function BrandPath(props: BrandChromeProps) {
  return (
    <div className={classNames("brand-path", props.className)}>
      <strong>{tokens.brand.author}</strong>
      <span className="brand-path__separator">|</span>
      <span>{tokens.brand.pathFrom}</span>
      <span className="brand-path__arrow" aria-hidden="true" />
      <span>{tokens.brand.pathTo}</span>
    </div>
  );
}

export function BrandFooter(props: BrandChromeProps) {
  return (
    <footer className={classNames("brand-footer", props.className)}>
      <span className="brand-footer__note">{tokens.brand.toplineSuffix}</span>
      <span className="brand-footer__signature">{brandSignature()}</span>
    </footer>
  );
}

function classNames(...items: readonly (string | undefined)[]): string {
  return items.filter(Boolean).join(" ");
}
