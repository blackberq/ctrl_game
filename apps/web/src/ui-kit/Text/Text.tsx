import { useThemedStyles } from "../ThemeProvider";
import { makeVariantStyles } from "./Text.styles";
import type { TextProps } from "./Text.types";

export function Text({ children, variant = "body", color, align, style }: TextProps) {
  const variantStyle = useThemedStyles(makeVariantStyles);
  return (
    <span style={{ ...variantStyle[variant], ...(color ? { color } : {}), textAlign: align, ...style }}>
      {children}
    </span>
  );
}
