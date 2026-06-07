import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";

export function makeInputStyle(theme: Theme): CSSProperties {
  return {
    padding: `${theme.spacing.sm}px ${theme.spacing.md}px`,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    background: theme.colors.background,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    width: "100%",
    boxSizing: "border-box",
  };
}
