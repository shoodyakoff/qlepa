import { ContentSlideChrome } from "./_shared/ContentSlideChrome";

export type ListSlideItem = {
  desc: string;
  icon: string;
  title: string;
};

export type ListSlideProps = {
  heading: string;
  items: readonly ListSlideItem[];
  kicker?: string;
  nickname: string;
  slideNumber: number;
  totalSlides: number;
};

export type ListSlideIconPresentation =
  | {
      kind: "symbol";
      className: string;
      label: string;
    }
  | {
      kind: "text";
      label: string;
    };

export function ListSlide(props: ListSlideProps) {
  return (
    <ContentSlideChrome
      kicker={props.kicker}
      nickname={props.nickname}
      slideNumber={props.slideNumber}
      totalSlides={props.totalSlides}
    >
      <section className="list-slide">
        <h1>{props.heading}</h1>
        <div className="list-slide__items">
          {props.items.map((item) => (
            <article className="list-slide__item" key={`${item.icon}-${item.title}`}>
              <ListSlideIcon icon={item.icon} />
              <div>
                <h2>{item.title}</h2>
                <p>{item.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </ContentSlideChrome>
  );
}

export function resolveListSlideIcon(icon: string): ListSlideIconPresentation {
  const normalized = icon.trim().toLowerCase();

  if (normalized === "search") {
    return {
      kind: "symbol",
      className: "list-slide__symbol list-slide__symbol--search",
      label: "search",
    };
  }

  if (normalized === "calendar") {
    return {
      kind: "symbol",
      className: "list-slide__symbol list-slide__symbol--calendar",
      label: "calendar",
    };
  }

  if (normalized === "doc" || normalized === "document") {
    return {
      kind: "symbol",
      className: "list-slide__symbol list-slide__symbol--doc",
      label: "document",
    };
  }

  return {
    kind: "text",
    label: icon.trim(),
  };
}

function ListSlideIcon(props: { icon: string }) {
  const icon = resolveListSlideIcon(props.icon);

  if (icon.kind === "symbol") {
    return (
      <span className="list-slide__icon" aria-label={icon.label}>
        <span className={icon.className} aria-hidden="true" />
      </span>
    );
  }

  return (
    <span className="list-slide__icon" aria-label={icon.label}>
      <span className="list-slide__icon-text" aria-hidden="true">
        {icon.label}
      </span>
    </span>
  );
}
