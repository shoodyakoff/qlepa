import { SlideFrame } from "./_shared/SlideFrame";
import {
  Asterisk,
  BenefitRow,
  DigestFooter,
  DigestHeadline,
  DigestTopline,
  MascotScene,
  type DigestCtaData,
} from "./digest-blocks";

export type DigestCtaProps = {
  data: DigestCtaData;
  slideNumber: number;
  totalSlides: number;
  footerNote?: string;
  nickname?: string;
  signature?: string;
};

export function DigestCta(props: DigestCtaProps) {
  const { data } = props;

  return (
    <SlideFrame className="digest digest-cta" variant="content">
      <Asterisk className="digest-asterisk--corner" />
      <DigestTopline
        slideNumber={props.slideNumber}
        totalSlides={props.totalSlides}
        nickname={props.nickname}
      />
      <div className="digest-cta__body">
        <div className="digest-cta__head">
          <div className="digest-cta__copy">
            <DigestHeadline headline={data.headline} accentLines={data.accentLines} />
            {data.intro ? <p className="digest-intro">{data.intro}</p> : null}
          </div>
          <MascotScene image={data.image} className="digest-mascot--cta" />
        </div>
        {data.benefits && data.benefits.length > 0 ? (
          <BenefitRow items={data.benefits} title="ЧТО ТЫ ПОЛУЧАЕШЬ" />
        ) : null}
        {data.cta || data.note ? (
          <div className="digest-cta__panel">
            {data.cta ? <span className="digest-cta__button">{data.cta.label}</span> : null}
            {data.note ? <p className="digest-cta__note">{data.note}</p> : null}
          </div>
        ) : null}
      </div>
      <DigestFooter note={props.footerNote} signature={props.signature} />
    </SlideFrame>
  );
}
