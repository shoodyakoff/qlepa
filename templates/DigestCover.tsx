import { SlideFrame } from "./_shared/SlideFrame";
import { Asterisk, DigestHeadline, DigestTopline, type DigestCoverData } from "./digest-blocks";

export type DigestCoverProps = {
  data: DigestCoverData;
  slideNumber: number;
  totalSlides: number;
  nickname?: string;
};

export function DigestCover(props: DigestCoverProps) {
  const { data } = props;

  return (
    <SlideFrame backgroundImage={data.image} className="digest digest-cover" variant="cover">
      <Asterisk className="digest-asterisk--cover" />
      <DigestTopline
        slideNumber={props.slideNumber}
        totalSlides={props.totalSlides}
        nickname={props.nickname}
      />
      <div className="digest-cover__copy">
        <DigestHeadline headline={data.title} accentLines="2" />
        {data.subline ? <p className="digest-cover__subline">{data.subline}</p> : null}
      </div>
      {data.scrollCue ? <span className="digest-cover__scroll">{data.scrollCue}</span> : null}
    </SlideFrame>
  );
}
