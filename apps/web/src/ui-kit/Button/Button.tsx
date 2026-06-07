import { useThemedStyles } from "../ThemeProvider";
import { makeButtonStyle } from "./Button.styles";
import type { ButtonProps } from "./Button.types";

export function Button({
  children,
  onPress,
  variant = "secondary",
  disabled = false,
  fullWidth = false,
}: ButtonProps) {
  const buttonStyle = useThemedStyles(makeButtonStyle);
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onPress}
      style={buttonStyle(variant, disabled, fullWidth)}
    >
      {children}
    </button>
  );
}
