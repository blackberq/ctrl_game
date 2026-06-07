import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
    },
    selected: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    text: { fontSize: theme.fontSize.sm, color: theme.colors.text },
    textSelected: { color: theme.colors.primaryText },
  });
}
