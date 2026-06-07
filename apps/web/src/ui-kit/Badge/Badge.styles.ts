import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";
import type { BadgeTone } from "./Badge.types";

export function makeBadgeStyle(theme: Theme) {
  const toneColor: Record<BadgeTone, string> = {
    neutral: theme.colors.textMuted,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    accent: theme.colors.primary,
  };

  return (tone: BadgeTone): CSSProperties => ({
    display: "inline-block",
    padding: `2px ${theme.spacing.sm}px`,
    borderRadius: theme.radius.pill,
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.semibold,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    color: toneColor[tone],
    background: theme.colors.surface,
  });
}
