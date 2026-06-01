import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import { validateCarouselQuality } from "../src/lib/carousel-quality";
import { parsePostFile } from "../src/lib/post-parser";
import { DigestCover } from "../templates/DigestCover";
import { DigestCta } from "../templates/DigestCta";
import { DigestUpdate } from "../templates/DigestUpdate";

describe("digest templates", () => {
  it("renders an update slide with every optional block", () => {
    const markup = renderToStaticMarkup(
      <DigestUpdate
        slideNumber={2}
        totalSlides={7}
        data={{
          kind: "digest-update",
          badge: "СЪЁМКА",
          headline: "СНИМАЮ ТОЛЬКО\nЖИВЫЕ КУСКИ",
          intro: "Лицом записываю только начало и финал.",
          bubble: "Это заводик, не магия",
          features: [{ icon: "lightning", title: "Быстрее", desc: "меньше переделок" }],
          flow: [
            { step: "Карточка", desc: "в базе" },
            { step: "Сборка", desc: "по правилам" },
          ],
          checklist: ["Меньше переделок"],
          compare: { oldTitle: "Было", old: ["Долго"], newTitle: "Стало", new: ["Пачка"] },
        }}
      />,
    );

    expect(markup).toContain("digest-update");
    expect(markup).toContain("digest-features");
    expect(markup).toContain("digest-flow");
    expect(markup).toContain("digest-compare");
    expect(markup).toContain("digest-checklist");
    expect(markup).toContain("digest-bubble");
    expect(markup).toContain("digest-footer");
  });

  it("renders cover and cta slides", () => {
    const cover = renderToStaticMarkup(
      <DigestCover
        slideNumber={1}
        totalSlides={7}
        data={{ kind: "digest-cover", title: "10\nРОЛИКОВ", subline: "Заводик", scrollCue: "Листай →" }}
      />,
    );

    expect(cover).toContain("digest-cover");
    expect(cover).toContain("digest-cover__scroll");

    const cta = renderToStaticMarkup(
      <DigestCta
        slideNumber={7}
        totalSlides={7}
        data={{
          kind: "digest-cta",
          headline: "10\nМИНУТ",
          benefits: [{ icon: "rocket", title: "Скорость", desc: "за вечер" }],
          cta: { label: "→ собрать" },
          note: "канал",
        }}
      />,
    );

    expect(cta).toContain("digest-cta__button");
    expect(cta).toContain("digest-benefits");
  });

  it("keeps the public starter digest post clean through the quality gate", async () => {
    const post = await parsePostFile("posts/starter-digest");

    expect(post.slides.map((slide) => slide.kind)).toEqual([
      "digest-cover",
      "digest-update",
      "digest-update",
      "digest-update",
      "digest-update",
      "digest-update",
      "digest-cta",
    ]);
    expect(validateCarouselQuality(post)).toEqual([]);
  });
});
