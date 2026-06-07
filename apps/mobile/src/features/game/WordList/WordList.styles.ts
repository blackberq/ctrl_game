import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: theme.radius.md,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
    },
    rowUsed: {
      borderColor: theme.colors.success,
      backgroundColor: theme.colors.successSurface,
    },
    word: { fontSize: theme.fontSize.lg, color: theme.colors.text },
  });
}
