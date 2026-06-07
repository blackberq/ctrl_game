import { Pressable, Text } from 'react-native';
import { useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Button.styles';
import type { ButtonProps } from './Button.types';

export function Button({
  children,
  onPress,
  variant = 'secondary',
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const { styles, labelColor } = useThemedStyles(makeStyles);
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.label, { color: labelColor[variant] }]}>{children}</Text>
    </Pressable>
  );
}
