import type { ReactNode } from "react";

import { BrandFooter, BrandPath } from "./BrandChrome";
import { SlideFrame } from "./SlideFrame";
import { SlideNumber } from "./SlideNumber";

export type ContentSlideChromeProps = {
  children: ReactNode;
  kicker?: string;
  nickname: string;
  slideNumber: number;
  totalSlides: number;
  variant?: "plain" | "accent" | "image" | "quote";
};

export function ContentSlideChrome({
  children,
  kicker,
  nickname,
  slideNumber,
  totalSlides,
  variant = "plain",
}: ContentSlideChromeProps) {
  return (
    <SlideFrame className={`content-slide content-slide--${variant}`} variant="content">
      <div className="content-topline">
        <BrandPath />
        <div className="content-topline__right">
          {kicker ? <span className="content-kicker">{kicker}</span> : null}
          <SlideNumber slideNumber={slideNumber} totalSlides={totalSlides} />
        </div>
      </div>
      <div className="content-main">{children}</div>
      <BrandFooter className="content-footer" />
    </SlideFrame>
  );
}
