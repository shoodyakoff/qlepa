import { SlideFrame } from "./_shared/SlideFrame";
import {
  Asterisk,
  Checklist,
  CompareCards,
  DigestFooter,
  DigestHeadline,
  DigestTopline,
  FeatureList,
  FlowSteps,
  MascotScene,
  SpeechBubble,
  type DigestUpdateData,
} from "./digest-blocks";

export type DigestUpdateProps = {
  data: DigestUpdateData;
  slideNumber: number;
  totalSlides: number;
  footerNote?: string;
  nickname?: string;
  signature?: string;
};

export function DigestUpdate(props: DigestUpdateProps) {
  const { data } = props;
  const hasBands = Boolean(
    data.flow?.length || data.compare || data.checklist?.length,
  );

  return (
    <SlideFrame className="digest digest-update" variant="content">
      <Asterisk className="digest-asterisk--corner" />
      <DigestTopline
        slideNumber={props.slideNumber}
        totalSlides={props.totalSlides}
        nickname={props.nickname}
      />
      <div className={`digest-update__body${hasBands ? " digest-update__body--bands" : ""}`}>
        <div className="digest-update__top">
          <div className="digest-update__copy">
            {data.badge ? <span className="digest-badge">{data.badge}</span> : null}
            <DigestHeadline headline={data.headline} accentLines={data.accentLines} />
            <p className="digest-intro">{data.intro}</p>
            {data.features && data.features.length > 0 ? (
              <FeatureList items={data.features} />
            ) : null}
          </div>
          <div className="digest-update__aside">
            {data.bubble ? <SpeechBubble text={data.bubble} /> : null}
            <MascotScene image={data.image} />
          </div>
        </div>
        {hasBands ? (
          <div className="digest-update__bands">
            {data.flow && data.flow.length > 0 ? (
              <FlowSteps steps={data.flow} title="КАК ЭТО РАБОТАЕТ" />
            ) : null}
            {data.compare ? <CompareCards compare={data.compare} /> : null}
            {data.checklist && data.checklist.length > 0 ? (
              <Checklist items={data.checklist} title="ЧТО ЭТО ДАЁТ" />
            ) : null}
          </div>
        ) : null}
      </div>
      <DigestFooter note={props.footerNote} signature={props.signature} />
    </SlideFrame>
  );
}
