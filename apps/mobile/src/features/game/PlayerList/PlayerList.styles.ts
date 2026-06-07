import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.radius.md,
      backgroundColor: theme.colors.surface,
    },
    offline: { opacity: 0.45 },
    name: { fontSize: theme.fontSize.md, color: theme.colors.text },
    score: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
  });
}
