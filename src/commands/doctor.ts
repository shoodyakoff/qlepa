import { readdir, stat } from "node:fs/promises";
import path from "node:path";

export type DoctorStatus = "PASS" | "WARN" | "FAIL";

export type DoctorCheck = {
  status: DoctorStatus;
  label: string;
  detail: string;
};

export type DoctorOptions = {
  nodeVersion?: string;
};

const MIN_NODE_MAJOR = 22;

export async function collectDoctorChecks(
  projectRoot = process.cwd(),
  options: DoctorOptions = {},
): Promise<readonly DoctorCheck[]> {
  const nodeVersion = options.nodeVersion ?? process.versions.node;
  const checks: DoctorCheck[] = [checkNodeVersion(nodeVersion)];

  checks.push(await checkFile(projectRoot, "package.json", "package.json"));
  checks.push(await checkDirectory(projectRoot, "assets/face-refs", "reference folder"));
  checks.push(await checkDirectory(projectRoot, "assets/generated", "generated cache folder"));
  checks.push(await checkAnyFile(projectRoot, "brand/prompts", ".md", "brand prompts"));
  checks.push(await checkAnyFile(projectRoot, "brand/fonts", ".ttf", "local fonts"));
  checks.push(await checkFile(projectRoot, "posts/starter-post/post.md", "starter post"));
  checks.push(await checkFile(projectRoot, "posts/starter-digest/post.md", "starter digest"));
  checks.push(await checkOptionalFile(projectRoot, "assets/face-refs/face.jpg", "face reference"));
  checks.push(await checkOptionalFile(projectRoot, "assets/face-refs/body.jpg", "body reference"));
  checks.push(await checkOptionalFile(projectRoot, "assets/face-refs/style.jpg", "style reference"));

  return checks;
}

export function formatDoctorReport(checks: readonly DoctorCheck[]): string {
  return [
    "Qlepa doctor",
    "",
    ...checks.map((check) => `${check.status} ${check.label} - ${check.detail}`),
  ].join("\n");
}

export async function runDoctorCommand(projectRoot = process.cwd()): Promise<void> {
  const checks = await collectDoctorChecks(projectRoot);
  console.log(formatDoctorReport(checks));

  if (checks.some((check) => check.status === "FAIL")) {
    throw new Error("Doctor found setup failures. Fix FAIL items and run doctor again.");
  }
}

function checkNodeVersion(version: string): DoctorCheck {
  const major = Number(version.split(".")[0]);
  if (Number.isFinite(major) && major >= MIN_NODE_MAJOR) {
    return {
      status: "PASS",
      label: "Node",
      detail: `v${version}`,
    };
  }

  return {
    status: "FAIL",
    label: "Node",
    detail: `v${version}; expected Node ${MIN_NODE_MAJOR}+ for TypeScript stripping`,
  };
}

async function checkFile(projectRoot: string, relativePath: string, label: string): Promise<DoctorCheck> {
  const filePath = path.join(projectRoot, relativePath);
  if (await isFile(filePath)) {
    return { status: "PASS", label, detail: relativePath };
  }

  return { status: "FAIL", label, detail: `missing ${relativePath}` };
}

async function checkDirectory(projectRoot: string, relativePath: string, label: string): Promise<DoctorCheck> {
  const dirPath = path.join(projectRoot, relativePath);
  if (await isDirectory(dirPath)) {
    return { status: "PASS", label, detail: relativePath };
  }

  return { status: "FAIL", label, detail: `missing ${relativePath}` };
}

async function checkAnyFile(
  projectRoot: string,
  relativePath: string,
  extension: string,
  label: string,
): Promise<DoctorCheck> {
  const dirPath = path.join(projectRoot, relativePath);
  try {
    const entries = await readdir(dirPath, { withFileTypes: true });
    const hasMatch = entries.some((entry) => entry.isFile() && entry.name.endsWith(extension));
    if (hasMatch) {
      return { status: "PASS", label, detail: `${relativePath}/*${extension}` };
    }
  } catch {
    return { status: "FAIL", label, detail: `missing ${relativePath}` };
  }

  return { status: "FAIL", label, detail: `no ${extension} files in ${relativePath}` };
}

async function checkOptionalFile(projectRoot: string, relativePath: string, label: string): Promise<DoctorCheck> {
  const filePath = path.join(projectRoot, relativePath);
  if (await isFile(filePath)) {
    return { status: "PASS", label, detail: relativePath };
  }

  if (relativePath.endsWith("style.jpg")) {
    return { status: "WARN", label, detail: `${relativePath} is optional composition reference` };
  }

  return { status: "WARN", label, detail: `add ${relativePath} only for photo-cover with you` };
}

async function isFile(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isFile();
  } catch {
    return false;
  }
}

async function isDirectory(filePath: string): Promise<boolean> {
  try {
    return (await stat(filePath)).isDirectory();
  } catch {
    return false;
  }
}
