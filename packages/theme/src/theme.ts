import { darkColors, lightColors, type Colors } from "./colors";
import { spacing } from "./spacing";
import { radius } from "./radius";
import { fontSize, fontWeight } from "./typography";

export type ColorScheme = "light" | "dark";

/** Build a full theme object for the given color palette. */
function createTheme(colors: Colors) {
  return { colors, spacing, radius, fontSize, fontWeight } as const;
}

export const lightTheme = createTheme(lightColors);
export const darkTheme = createTheme(darkColors);

/** Resolve a theme from a color scheme. */
export function getTheme(scheme: ColorScheme) {
  return scheme === "dark" ? darkTheme : lightTheme;
}

/** Default static theme (light) — for any non-reactive usage. */
export const theme = lightTheme;

export type Theme = typeof lightTheme;
