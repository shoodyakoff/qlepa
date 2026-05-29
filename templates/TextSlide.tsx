import { ContentSlideChrome } from "./_shared/ContentSlideChrome";

export type TextSlideProps = {
  body: string;
  heading: string;
  kicker?: string;
  nickname: string;
  slideNumber: number;
  totalSlides: number;
};

export function TextSlide(props: TextSlideProps) {
  return (
    <ContentSlideChrome
      kicker={props.kicker}
      nickname={props.nickname}
      slideNumber={props.slideNumber}
      totalSlides={props.totalSlides}
      variant="accent"
    >
      <section className="text-slide">
        <h1>{props.heading}</h1>
        <p>{props.body}</p>
      </section>
    </ContentSlideChrome>
  );
}
