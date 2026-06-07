import { View } from 'react-native';
import { useTheme, useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Card.styles';
import type { CardProps } from './Card.types';

export function Card({ children, tone = 'surface', gap, style }: CardProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <View style={[styles.base, styles[tone], { gap: gap ?? theme.spacing.sm }, style]}>
      {children}
    </View>
  );
}
