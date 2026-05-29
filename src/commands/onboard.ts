import path from "node:path";

const referenceFiles = [
  "assets/face-refs/face.jpg",
  "assets/face-refs/body.jpg",
  "assets/face-refs/style.jpg",
] as const;

export function buildOnboardingText(projectRoot = process.cwd()): string {
  const rel = (value: string) => path.relative(projectRoot, path.join(projectRoot, value));

  return [
    "Онбординг Qlepa",
    "",
    "1. Установите зависимости",
    "   npm exec -- pnpm install",
    "",
    "2. Откройте этот проект в Codex или Claude",
    "   Вставьте в чат:",
    "   Прочитай README.md, docs/chat-onboarding.md, docs/agent-dialogue.md и AGENTS.md.",
    "   Онборди меня в Qlepa. Спроси только недостающие данные бренда и референсы.",
    "",
    "3. Пришлите в чат",
    "   - имя или название бренда",
    "   - публичный ник",
    "   - ссылка на ТГ-канал или основной канал публикации",
    "   - темы, аудиторию и тон текста",
    "   - тон и voice: как вы обычно пишете, какие слова любите и какие нельзя",
    "   - цвета, если они есть; если нет, оставьте стандартные",
    "   - режим обложки: с вашим фото или без вашего фото",
    "   - фото лица",
    "   - фото в полный рост или по пояс",
    "   - или напишите: без моего фото, если не хотите обложку с собой",
    "   - опционально: картинку-референс стиля",
    "",
    "4. Агент сохранит приватные файлы, если выбран режим с вашим фото",
    `   Лицо: ${rel(referenceFiles[0])}`,
    `   Тело: ${rel(referenceFiles[1])}`,
    `   Стиль: ${rel(referenceFiles[2])}`,
    "   Лицо и тело не нужны для обложки без вашего фото.",
    "   Он также обновит brand/tokens.ts и brand/voice.md.",
    "   Локальные шрифты лучше не менять на первом запуске.",
    "",
    "5. Проверьте готовность",
    "   Если вы уже запустили npm run start, проверка будет ниже.",
    "   Если открыли только onboard, запустите: npm run start",
    "",
    "6. Команды старта в чате",
    "   /start, start, старт — один и тот же сценарий Qlepa onboarding.",
    "",
    "7. Начните с примера",
    "   posts/starter-post/post.md",
    "",
    "8. Откройте превью и соберите PNG",
    "   npm run carousel -- preview posts/starter-post",
    "   npm run carousel -- build posts/starter-post",
    "",
    "Фраза готовности",
    "   Техническая готовность — это только готовность репозитория.",
    "   Это не значит, что Qlepa уже знает ваш бренд, tone of voice, ТГ-канал или фото.",
    "   Проект готов. Сначала пришлите недостающие данные бренда и референсы.",
    "   Если бренд уже настроен, пришлите идею поста или черновик текста.",
    "",
    "После установки",
    "   Если хотите начать работу, напишите в чат: старт",
  ].join("\n");
}

export async function runOnboardCommand(projectRoot = process.cwd()): Promise<void> {
  console.log(buildOnboardingText(projectRoot));
}
