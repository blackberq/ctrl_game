import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    base: {
      padding: theme.spacing.md,
      borderRadius: theme.radius.lg,
      borderWidth: 1,
    },
    surface: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
    accent: { backgroundColor: theme.colors.accentSurface, borderColor: theme.colors.accentBorder },
    success: { backgroundColor: theme.colors.successSurface, borderColor: theme.colors.success },
  });
}
