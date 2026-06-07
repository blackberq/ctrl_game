import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    banner: {
      backgroundColor: theme.colors.dangerSurface,
      borderRadius: theme.radius.md,
      padding: theme.spacing.sm,
    },
  });
}
