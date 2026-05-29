import type { ReactNode } from "react";

import { tokens } from "../../brand/tokens";

export type SlideFrameProps = {
  backgroundImage?: string;
  children: ReactNode;
  className?: string;
  variant?: "cover" | "content";
};

export function SlideFrame({
  backgroundImage,
  children,
  className,
  variant = "cover",
}: SlideFrameProps) {
  return (
    <article
      className={["slide-frame", `slide-frame--${variant}`, className].filter(Boolean).join(" ")}
      style={{
        width: tokens.sizes.slide.w,
        height: tokens.sizes.slide.h,
      }}
    >
      {backgroundImage ? (
        <img className="slide-frame__image" src={backgroundImage} alt="" aria-hidden="true" />
      ) : (
        <div className="slide-frame__fallback" aria-hidden="true" />
      )}
      {variant === "cover" ? <div className="slide-frame__shade" aria-hidden="true" /> : null}
      <div className="slide-frame__content">{children}</div>
    </article>
  );
}
