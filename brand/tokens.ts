export const tokens = {
  brand: {
    author: "Your Name",
    handle: "@your_handle",
    name: "Qlepa",
    pathFrom: "Idea",
    pathTo: "carousel",
    toplineSuffix: "Local carousel workflow",
  },
  colors: {
    paper: "#F7F3EA",
    surface: "#FFFDF8",
    ink: "#444C5C",
    accent: "#CE5A57",
    secondary: "#78A5A3",
    warm: "#E1B16A",
    line: "#D8D2C6",
    muted: "#6F7480",
    background: "#F7F3EA",
    foreground: "#444C5C",
    hotAccent: "#E1B16A",
  },
  fonts: {
    display: '"Tektur", "Arial Black", "Arial Narrow", "Arial Condensed", Impact, sans-serif',
    body: '"Manrope", system-ui, sans-serif',
    accent: '"Manrope", system-ui, sans-serif',
  },
  sizes: {
    slide: { w: 1080, h: 1350 },
    titleDisplay: 96,
    titleLarge: 72,
    body: 36,
    caption: 24,
  },
  spacing: {
    margin: 80,
    gap: 32,
  },
  radius: {
    card: 24,
    pill: 999,
  },
} as const;
