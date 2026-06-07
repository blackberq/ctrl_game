import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";

export function makeStyles(theme: Theme) {
  return {
    fieldLabel: {
      fontSize: theme.fontSize.sm,
      color: theme.colors.textMuted,
    } as CSSProperties,
    divider: {
      textAlign: "center",
      fontSize: theme.fontSize.sm,
      color: theme.colors.textMuted,
    } as CSSProperties,
    checkboxRow: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing.sm,
      cursor: "pointer",
    } as CSSProperties,
    rulesList: {
      margin: 0,
      paddingLeft: theme.spacing.lg,
      color: theme.colors.textMuted,
      fontSize: theme.fontSize.sm,
      lineHeight: 1.5,
    } as CSSProperties,
  };
}
