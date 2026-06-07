import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';
import type { ButtonVariant } from './Button.types';

export function makeStyles(theme: Theme) {
  const styles = StyleSheet.create({
    base: {
      paddingVertical: theme.spacing.md,
      paddingHorizontal: theme.spacing.lg,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      alignItems: 'center',
    },
    primary: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
    secondary: { backgroundColor: theme.colors.surface, borderColor: theme.colors.border },
    ghost: { backgroundColor: 'transparent', borderColor: 'transparent' },
    fullWidth: { alignSelf: 'stretch' },
    disabled: { opacity: 0.45 },
    pressed: { opacity: 0.7 },
    label: { fontSize: theme.fontSize.md, fontWeight: theme.fontWeight.medium },
  });

  const labelColor: Record<ButtonVariant, string> = {
    primary: theme.colors.primaryText,
    secondary: theme.colors.text,
    ghost: theme.colors.primary,
  };

  return { styles, labelColor };
}
