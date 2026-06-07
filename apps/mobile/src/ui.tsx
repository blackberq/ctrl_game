import { Pressable, StyleSheet, Text } from 'react-native';

interface BtnProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  primary?: boolean;
}

export function Btn({ title, onPress, disabled, primary }: BtnProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.btn,
        primary && styles.primary,
        disabled && styles.disabled,
        pressed && styles.pressed,
      ]}>
      <Text style={[styles.txt, primary && styles.primaryTxt]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bbb',
    alignItems: 'center',
  },
  primary: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  disabled: { opacity: 0.45 },
  pressed: { opacity: 0.7 },
  txt: { fontSize: 16, color: '#111' },
  primaryTxt: { color: '#fff' },
});
