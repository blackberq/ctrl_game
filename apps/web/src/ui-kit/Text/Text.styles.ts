import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";
import type { TextVariant } from "./Text.types";

export function makeVariantStyles(theme: Theme): Record<TextVariant, CSSProperties> {
  return {
    title: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
    heading: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
    body: { fontSize: theme.fontSize.md, color: theme.colors.text },
    muted: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
    label: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.semibold,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      color: theme.colors.textMuted,
    },
  };
}
