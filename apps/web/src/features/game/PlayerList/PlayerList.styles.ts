import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";

export function makeStyles(theme: Theme) {
  return {
    row: (connected: boolean): CSSProperties => ({
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      borderRadius: theme.radius.md,
      background: theme.colors.surface,
      opacity: connected ? 1 : 0.45,
    }),
    score: {
      fontWeight: theme.fontWeight.bold,
      color: theme.colors.text,
    } as CSSProperties,
  };
}
