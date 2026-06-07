import type { CSSProperties } from "react";
import type { Theme } from "@ctrl-game/theme";
import type { ButtonVariant } from "./Button.types";

export function makeButtonStyle(theme: Theme) {
  const variants: Record<ButtonVariant, CSSProperties> = {
    primary: {
      background: theme.colors.primary,
      color: theme.colors.primaryText,
      borderColor: theme.colors.primary,
    },
    secondary: {
      background: theme.colors.surface,
      color: theme.colors.text,
      borderColor: theme.colors.border,
    },
    ghost: {
      background: "transparent",
      color: theme.colors.primary,
      borderColor: "transparent",
    },
  };

  return (variant: ButtonVariant, disabled: boolean, fullWidth: boolean): CSSProperties => ({
    padding: `${theme.spacing.sm}px ${theme.spacing.lg}px`,
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.medium,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderStyle: "solid",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    width: fullWidth ? "100%" : undefined,
    ...variants[variant],
  });
}
