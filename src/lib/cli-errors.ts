const POST_PATH_HINT =
  "Hint: pass a post directory containing post.md, or pass the markdown file directly.";
const POST_FORMAT_HINT = "Hint: compare the post.md structure with the examples in README.md.";

export function formatCliError(error: unknown): string {
  const message = error instanceof Error ? error.message : String(error);

  if (message.startsWith("Usage:")) {
    return message;
  }

  if (message.startsWith("Post path does not exist:")) {
    return [message, POST_PATH_HINT].join("\n");
  }

  if (message.includes("ENOENT") && message.includes("post.md")) {
    return [`Cannot find post.md for the requested post path.`, POST_PATH_HINT].join("\n");
  }

  if (isPostFormatError(message)) {
    return [message, POST_FORMAT_HINT].join("\n");
  }

  return message;
}

function isPostFormatError(message: string): boolean {
  return (
    message.startsWith("Unknown slide block kind:") ||
    message.startsWith("Cannot parse post.md line:") ||
    message.startsWith("Cannot parse list item line:") ||
    message.startsWith("Expected inline object list item") ||
    message.startsWith("Frontmatter starts with") ||
    message.startsWith("No slide blocks found in post.md") ||
    /^Missing .+ in .+ slide$/.test(message)
  );
}
