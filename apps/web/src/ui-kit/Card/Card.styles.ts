import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";
import type { CardTone } from "./Card.types";

export function makeCardStyle(theme: Theme) {
  const tones: Record<CardTone, CSSProperties> = {
    surface: { background: theme.colors.surface, borderColor: theme.colors.border },
    accent: { background: theme.colors.accentSurface, borderColor: theme.colors.accentBorder },
    success: { background: theme.colors.successSurface, borderColor: theme.colors.success },
  };

  return (tone: CardTone, gap: number): CSSProperties => ({
    display: "flex",
    flexDirection: "column",
    gap,
    padding: theme.spacing.md,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderStyle: "solid",
    ...tones[tone],
  });
}
