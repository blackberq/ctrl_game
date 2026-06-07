import { Text as RNText } from 'react-native';
import { useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Text.styles';
import type { TextProps } from './Text.types';

export function Text({ children, variant = 'body', color, style }: TextProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <RNText style={[styles[variant], color ? { color } : null, style]}>{children}</RNText>
  );
}
