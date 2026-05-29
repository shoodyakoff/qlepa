import { buildHelpText } from "./cli-help.ts";
import { runBuildCommand } from "./commands/build.ts";
import { runDoctorCommand } from "./commands/doctor.ts";
import { runGenPhotoCommand } from "./commands/gen-photo.ts";
import { runOnboardCommand } from "./commands/onboard.ts";
import { runPreviewCommand } from "./commands/preview.ts";
import { runRenderTestCommand } from "./commands/render-test.ts";
import { runStartCommand } from "./commands/start.ts";
import { formatCliError } from "./lib/cli-errors.ts";

const HELP_FLAGS = new Set(["--help", "-h", "help"]);

export async function runCli(args: readonly string[] = process.argv.slice(2)): Promise<number> {
  const [command] = args;

  if (!command || HELP_FLAGS.has(command)) {
    console.log(buildHelpText());
    return 0;
  }

  if (command === "render-test") {
    await runRenderTestCommand();
    return 0;
  }

  if (command === "start") {
    await runStartCommand();
    return 0;
  }

  if (command === "onboard") {
    await runOnboardCommand();
    return 0;
  }

  if (command === "doctor") {
    await runDoctorCommand();
    return 0;
  }

  if (command === "build") {
    await runBuildCommand(args.slice(1));
    return 0;
  }

  if (command === "preview") {
    await runPreviewCommand(args.slice(1));
    return 0;
  }

  if (command === "gen-photo") {
    await runGenPhotoCommand(args.slice(1));
    return 0;
  }

  console.error(`Unknown command: ${command}`);
  console.log("");
  console.log(buildHelpText());
  return 1;
}

const isDirectRun = process.argv[1]?.endsWith("/src/cli.ts") ?? false;

if (isDirectRun) {
  runCli()
    .then((code) => {
      process.exitCode = code;
    })
    .catch((error: unknown) => {
      console.error(formatCliError(error));
      process.exitCode = 1;
    });
}
