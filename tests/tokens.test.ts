import { describe, expect, it } from "vitest";

import { tokens } from "../brand/tokens";

describe("brand tokens", () => {
  it("defines the social carousel slide size", () => {
    expect(tokens.sizes.slide).toEqual({ w: 1080, h: 1350 });
  });

  it("uses safe public starter brand chrome", () => {
    expect(tokens.brand).toEqual({
      author: "Your Name",
      handle: "@your_handle",
      name: "Qlepa",
      pathFrom: "Idea",
      pathTo: "carousel",
      toplineSuffix: "Local carousel workflow",
    });
  });

  it("uses the public starter palette", () => {
    expect(tokens.colors).toMatchObject({
      paper: "#F7F3EA",
      surface: "#FFFDF8",
      ink: "#444C5C",
      accent: "#CE5A57",
      secondary: "#78A5A3",
      warm: "#E1B16A",
      line: "#D8D2C6",
      muted: "#6F7480",
    });
  });

  it("keeps existing color token aliases mapped to the new roles", () => {
    expect(tokens.colors).toMatchObject({
      background: tokens.colors.paper,
      foreground: tokens.colors.ink,
      hotAccent: tokens.colors.warm,
    });
  });

  it("uses Tektur as the display heading font", () => {
    expect(tokens.fonts.display).toContain('"Tektur"');
  });

  it("uses Manrope as the body font", () => {
    expect(tokens.fonts.body).toContain('"Manrope"');
  });
});
