import { BrandFooter, BrandPath } from "./_shared/BrandChrome";
import { SlideFrame } from "./_shared/SlideFrame";

export type CoverProps = {
  title: string;
  subtitle: string;
  backgroundImage?: string;
  textSurface?: boolean;
  nickname: string;
  slideNumber: number;
  totalSlides: number;
};

export function Cover(props: CoverProps) {
  return (
    <SlideFrame
      backgroundImage={props.backgroundImage}
      className={props.textSurface ? "cover cover--text-surface" : "cover"}
    >
      <div className="cover-topline">
        <BrandPath className="cover-brand-path" />
      </div>
      <div className="cover-copy">
        <h1>{props.title}</h1>
        <p>{props.subtitle}</p>
      </div>
      <BrandFooter className="cover-footer" />
    </SlideFrame>
  );
}
