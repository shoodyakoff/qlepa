import { SlideFrame } from "./_shared/SlideFrame";

const fontOptions = [
  { className: "font-tektur", name: "Tektur", note: "display / заголовки" },
  { className: "font-manrope", name: "Manrope", note: "body / подписи" },
] as const;

export function FontSamplerSlide() {
  return (
    <SlideFrame className="font-sampler-slide" variant="content">
      <header className="font-sampler-slide__header">
        <p className="font-sampler-slide__kicker">Шрифтовая пара карусели</p>
        <h1>Создай свой продукт</h1>
      </header>

      <section className="font-sampler-slide__grid" aria-label="Font samples">
        {fontOptions.map((font) => (
          <article className="font-sampler-card" key={font.name}>
            <div>
              <span className="font-sampler-card__name">{font.name}</span>
              <span className="font-sampler-card__note">{font.note}</span>
            </div>
            <p className={["font-sampler-card__sample", font.className].join(" ")}>
              Создай свой продукт
            </p>
          </article>
        ))}
      </section>
    </SlideFrame>
  );
}
