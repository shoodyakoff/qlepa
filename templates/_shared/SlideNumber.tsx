export type SlideNumberProps = {
  slideNumber: number;
  totalSlides: number;
};

export function SlideNumber({ slideNumber, totalSlides }: SlideNumberProps) {
  return (
    <div className="slide-number" aria-label={`Slide ${slideNumber} of ${totalSlides}`}>
      {slideNumber}/{totalSlides}
    </div>
  );
}
