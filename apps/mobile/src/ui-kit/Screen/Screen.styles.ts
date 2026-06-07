import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    scroll: { flex: 1, backgroundColor: theme.colors.background },
    content: { padding: theme.spacing.xl, gap: theme.spacing.md },
  });
}
