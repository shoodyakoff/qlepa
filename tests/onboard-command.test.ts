import path from "node:path";
import { describe, expect, it } from "vitest";

import { buildOnboardingText } from "../src/commands/onboard";

describe("onboard command", () => {
  it("prints a chat-first onboarding flow for a new tester", () => {
    const root = path.join("/tmp", "qlepa");
    const text = buildOnboardingText(root);

    expect(text).toContain("Онбординг Qlepa");
    expect(text).toContain("Пришлите в чат");
    expect(text).toContain("имя или название бренда");
    expect(text).toContain("ссылка на ТГ-канал");
    expect(text).toContain("тон и voice");
    expect(text).toContain("режим обложки");
    expect(text).toContain("фото лица");
    expect(text).toContain("фото в полный рост");
    expect(text).toContain("или напишите: без моего фото");
    expect(text).toContain("Лицо и тело не нужны");
    expect(text).toContain("картинку-референс стиля");
    expect(text).toContain("Агент сохранит приватные файлы");
    expect(text).toContain("Локальные шрифты лучше не менять");
    expect(text).toContain("posts/starter-post/post.md");
    expect(text).toContain("npm exec -- pnpm install");
    expect(text).toContain("/start, start, старт");
    expect(text).toContain("Сначала пришлите недостающие данные бренда и референсы");
    expect(text).toContain("Техническая готовность — это только готовность репозитория");
    expect(text).toContain("Если хотите начать работу, напишите в чат: старт");
    expect(text).toContain("assets/face-refs/face.jpg");
    expect(text).toContain("npm run start");
    expect(text).not.toContain("Пришлите идею поста или черновик текста");
  });
});
