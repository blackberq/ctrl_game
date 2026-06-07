import { useThemedStyles } from "../ThemeProvider";
import { makeInputStyle } from "./Input.styles";
import type { InputProps } from "./Input.types";

export function Input({ value, onChangeText, placeholder, maxLength, uppercase }: InputProps) {
  const inputStyle = useThemedStyles(makeInputStyle);
  return (
    <input
      value={value}
      placeholder={placeholder}
      maxLength={maxLength}
      onChange={(e) => onChangeText(uppercase ? e.target.value.toUpperCase() : e.target.value)}
      style={inputStyle}
    />
  );
}
