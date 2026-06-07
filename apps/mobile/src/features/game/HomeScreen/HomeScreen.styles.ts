import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    divider: { textAlign: 'center', fontSize: theme.fontSize.sm, color: theme.colors.textMuted },
  });
}
