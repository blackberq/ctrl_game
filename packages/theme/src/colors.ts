/**
 * Color palettes shared by web and mobile. Plain string values so they work in
 * both DOM style objects and React Native StyleSheet.
 */
export const lightColors = {
  primary: "#4f46e5",
  primaryText: "#ffffff",

  background: "#ffffff",
  surface: "rgba(99, 102, 120, 0.08)",
  border: "#cbd5e1",

  text: "#111827",
  textMuted: "#6b7280",

  success: "#16a34a",
  successSurface: "rgba(22, 163, 74, 0.10)",

  danger: "#dc2626",
  dangerSurface: "#fee2e2",
  dangerText: "#991b1b",

  warning: "#d97706",

  accentSurface: "rgba(79, 70, 229, 0.10)",
  accentBorder: "rgba(79, 70, 229, 0.35)",
} as const;

export const darkColors: Colors = {
  primary: "#6366f1",
  primaryText: "#ffffff",

  background: "#0b0f19",
  surface: "rgba(255, 255, 255, 0.06)",
  border: "#334155",

  text: "#e5e7eb",
  textMuted: "#9ca3af",

  success: "#22c55e",
  successSurface: "rgba(34, 197, 94, 0.15)",

  danger: "#ef4444",
  dangerSurface: "rgba(239, 68, 68, 0.18)",
  dangerText: "#fecaca",

  warning: "#f59e0b",

  accentSurface: "rgba(99, 102, 241, 0.18)",
  accentBorder: "rgba(99, 102, 241, 0.45)",
};

/** All palettes share the same keys; values are plain strings. */
export type ColorToken = keyof typeof lightColors;
export type Colors = Record<ColorToken, string>;

export const palettes = { light: lightColors, dark: darkColors } as const;
