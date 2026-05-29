import { ContentSlideChrome } from "./_shared/ContentSlideChrome";

export type QuoteSlideProps = {
  author: string;
  kicker?: string;
  nickname: string;
  quote: string;
  slideNumber: number;
  totalSlides: number;
};

export function QuoteSlide(props: QuoteSlideProps) {
  return (
    <ContentSlideChrome
      kicker={props.kicker}
      nickname={props.nickname}
      slideNumber={props.slideNumber}
      totalSlides={props.totalSlides}
      variant="quote"
    >
      <section className="quote-slide">
        <blockquote>{props.quote}</blockquote>
        <p>{props.author}</p>
      </section>
    </ContentSlideChrome>
  );
}
