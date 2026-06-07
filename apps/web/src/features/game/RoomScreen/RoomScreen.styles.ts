import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";
import type { ModeOption } from "./RoomScreen.types";

export const MODES: ModeOption[] = [
  { value: "classic", label: "Класичний" },
  { value: "fast", label: "Швидкий" },
  { value: "hard", label: "Складний" },
  { value: "spectator", label: "З глядачами" },
  { value: "team", label: "Командний" },
  { value: "host_input", label: "Слова ведучого" },
];

export function makeStyles(theme: Theme) {
  return {
    bar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      paddingBottom: theme.spacing.sm,
      borderBottom: `1px solid ${theme.colors.border}`,
    } as CSSProperties,
    timer: (low: boolean): CSSProperties => ({
      fontSize: theme.fontSize.display,
      fontWeight: theme.fontWeight.bold,
      textAlign: "center",
      color: low ? theme.colors.danger : theme.colors.text,
    }),
    select: {
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
    } as CSSProperties,
  };
}
