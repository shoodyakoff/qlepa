import { readFile } from "node:fs/promises";
import { describe, expect, it } from "vitest";

describe("public onboarding docs", () => {
  it("documents the chat handoff after install", async () => {
    const readme = await readFile("README.md", "utf8");
    const chatOnboarding = await readFile("docs/chat-onboarding.md", "utf8");

    expect(readme).toContain("напишите в чат: `старт`");
    expect(readme).toContain("`/start`, `start`, `старт`");
    expect(chatOnboarding).toContain("Если человек пишет `старт`");
    expect(chatOnboarding).toContain("`/start`, `start`, `старт`");
    expect(chatOnboarding).toContain("Отвечайте человеку по-русски");
    expect(chatOnboarding).toContain("Не показывайте пользователю служебные названия внутренних навыков");
    expect(chatOnboarding).toContain("Сначала соберите недостающие данные бренда");
    expect(chatOnboarding).toContain("READY TO RUN — это только техническая готовность");
    expect(chatOnboarding).toContain("не значит, что Qlepa знает бренд, tone of voice, ТГ-канал или фото");
    expect(chatOnboarding).toContain("фото лица");
    expect(chatOnboarding).toContain("фото по пояс или в полный рост");
    expect(chatOnboarding).toContain("не выбирайте настроение обложки");
    expect(chatOnboarding).toContain("outdoor-editorial-arrow");
    expect(chatOnboarding).toContain("private/brand.json");
    expect(chatOnboarding).toContain("Выберите режим первого поста");
    expect(chatOnboarding).toContain("Series Digest");
    expect(chatOnboarding).toContain("posts/starter-digest/post.md");
    expect(chatOnboarding).not.toMatch(/superpowers/iu);
  });

  it("explains why preview/build use a local server", async () => {
    const readme = await readFile("README.md", "utf8");

    expect(readme).toContain("Почему появляется локальный сервер");
    expect(readme).toContain("`npm run start` не запускает dev-сервер");
    expect(readme).toContain("Playwright");
    expect(readme).toContain("Template workbench");
    expect(readme).toContain("не список всех пайплайнов");
  });

  it("explains generated images, style selection, and reproducibility limits", async () => {
    const readme = await readFile("README.md", "utf8");
    const generatedReadme = await readFile("assets/generated/README.md", "utf8");
    const visualPipeline = await readFile("docs/reference-driven-visual-pipeline.md", "utf8");

    expect(readme).toContain("Новый человек не получит эти локальные PNG из git");
    expect(readme).toContain("робот не выбирается Qlepa автоматически");
    expect(readme).toContain("Фото-обложка Qlepa не выбирается по настроению");
    expect(readme).toContain("outdoor-editorial-arrow");
    expect(generatedReadme).toContain("не часть публичного репозитория");
    expect(visualPipeline).toContain("Объекты в generated scene выбираются");
    expect(visualPipeline).toContain("Стиль выбирается");
  });

  it("keeps the open GitHub guide aligned with the two-pipeline onboarding", async () => {
    const guide = await readFile("docs/open-github-mvp.md", "utf8");

    expect(guide).toContain("private/brand.json");
    expect(guide).toContain("brand/voice.local.md");
    expect(guide).toContain("Editorial / Artifact-Rich");
    expect(guide).toContain("Series Digest");
    expect(guide).toContain("posts/starter-digest/post.md");
    expect(guide).toContain("npm run carousel -- build posts/starter-digest");
    expect(guide).toContain("brand/tokens.ts");
    expect(guide).toContain("should remain generic");
  });
});
