import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";

export function makeStyles(theme: Theme) {
  return {
    topicText: {
      fontSize: theme.fontSize.lg,
      fontWeight: theme.fontWeight.semibold,
      color: theme.colors.text,
    } as CSSProperties,
  };
}
