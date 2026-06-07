import { Pressable, Text } from 'react-native';
import { useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Chip.styles';
import type { ChipProps } from './Chip.types';

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <Pressable onPress={onPress} style={[styles.base, selected && styles.selected]}>
      <Text style={[styles.text, selected && styles.textSelected]}>{label}</Text>
    </Pressable>
  );
}
