import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";

export function makeStyles(theme: Theme) {
  return {
    row: (used: boolean): CSSProperties => ({
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.sm,
      padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: used ? theme.colors.success : theme.colors.border,
      background: used ? theme.colors.successSurface : "transparent",
      fontSize: theme.fontSize.lg,
      color: theme.colors.text,
    }),
    label: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.sm,
      cursor: "pointer",
      width: "100%",
    } as CSSProperties,
  };
}
