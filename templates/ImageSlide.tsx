import { ContentSlideChrome } from "./_shared/ContentSlideChrome";

export type ImageSlideProps = {
  caption: string;
  heading: string;
  imageSrc?: string;
  kicker?: string;
  nickname: string;
  slideNumber: number;
  totalSlides: number;
};

export function ImageSlide(props: ImageSlideProps) {
  return (
    <ContentSlideChrome
      kicker={props.kicker}
      nickname={props.nickname}
      slideNumber={props.slideNumber}
      totalSlides={props.totalSlides}
      variant="image"
    >
      <section className="image-slide">
        <h1>{props.heading}</h1>
        <figure>
          {props.imageSrc ? (
            <img src={props.imageSrc} alt="" aria-hidden="true" />
          ) : (
            <div className="image-slide__placeholder" aria-hidden="true" />
          )}
          <figcaption>{props.caption}</figcaption>
        </figure>
      </section>
    </ContentSlideChrome>
  );
}
