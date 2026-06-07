import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    title: { fontSize: theme.fontSize.xxl, fontWeight: theme.fontWeight.bold, color: theme.colors.text },
    heading: { fontSize: theme.fontSize.lg, fontWeight: theme.fontWeight.semibold, color: theme.colors.text },
    body: { fontSize: theme.fontSize.md, color: theme.colors.text },
    muted: { fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
    label: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.semibold,
      letterSpacing: 0.5,
      color: theme.colors.textMuted,
    },
  });
}
