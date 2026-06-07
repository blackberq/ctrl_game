import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";

export function makeChipStyle(theme: Theme) {
  return (selected: boolean): CSSProperties => ({
    padding: `6px ${theme.spacing.md}px`,
    fontSize: theme.fontSize.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    cursor: "pointer",
    color: selected ? theme.colors.primaryText : theme.colors.text,
    background: selected ? theme.colors.primary : theme.colors.surface,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
  });
}
