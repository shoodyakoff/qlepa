import { collectDoctorChecks, formatDoctorReport, type DoctorCheck, type DoctorOptions } from "./doctor.ts";
import { buildOnboardingText } from "./onboard.ts";

export async function buildStartText(
  projectRoot = process.cwd(),
  options: DoctorOptions = {},
): Promise<string> {
  const checks = await collectDoctorChecks(projectRoot, options);
  return formatStartText(buildOnboardingText(projectRoot), checks);
}

export function formatStartText(onboardingText: string, checks: readonly DoctorCheck[]): string {
  const hasFailures = checks.some((check) => check.status === "FAIL");
  const statusLines = hasFailures
    ? [
        "NOT READY",
        "Исправьте строки с FAIL и запустите npm run start ещё раз.",
      ]
    : [
        "READY TO RUN",
        "В базовой настройке нет FAIL. WARN по референсам нормален, если вы выбрали обложку без своего фото или ещё не добавили фото.",
      ];

  return [
    "Старт Qlepa",
    "",
    onboardingText,
    "",
    "Проверка проекта",
    "",
    formatDoctorReport(checks),
    "",
    ...statusLines,
  ].join("\n");
}

export async function runStartCommand(projectRoot = process.cwd()): Promise<void> {
  const checks = await collectDoctorChecks(projectRoot);
  console.log(formatStartText(buildOnboardingText(projectRoot), checks));

  if (checks.some((check) => check.status === "FAIL")) {
    throw new Error("Проект не готов. Исправьте строки с FAIL и запустите npm run start ещё раз.");
  }
}
