import { TextInput } from 'react-native';
import { useTheme, useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Input.styles';
import type { InputProps } from './Input.types';

export function Input({ value, onChangeText, placeholder, maxLength, uppercase }: InputProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <TextInput
      value={value}
      onChangeText={text => onChangeText(uppercase ? text.toUpperCase() : text)}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      maxLength={maxLength}
      autoCapitalize={uppercase ? 'characters' : 'sentences'}
      style={styles.input}
    />
  );
}
