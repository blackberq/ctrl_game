import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';
import type { BadgeTone } from './Badge.types';

export function makeStyles(theme: Theme) {
  const styles = StyleSheet.create({
    pill: {
      alignSelf: 'flex-start',
      paddingVertical: 2,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.radius.pill,
      backgroundColor: theme.colors.surface,
    },
    text: {
      fontSize: theme.fontSize.xs,
      fontWeight: theme.fontWeight.semibold,
      letterSpacing: 0.5,
    },
  });

  const toneColor: Record<BadgeTone, string> = {
    neutral: theme.colors.textMuted,
    success: theme.colors.success,
    warning: theme.colors.warning,
    danger: theme.colors.danger,
    accent: theme.colors.primary,
  };

  return { styles, toneColor };
}
