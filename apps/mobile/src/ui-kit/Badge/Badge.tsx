import { Text, View } from 'react-native';
import { useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Badge.styles';
import type { BadgeProps } from './Badge.types';

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  const { styles, toneColor } = useThemedStyles(makeStyles);
  return (
    <View style={styles.pill}>
      <Text style={[styles.text, { color: toneColor[tone] }]}>{children}</Text>
    </View>
  );
}
