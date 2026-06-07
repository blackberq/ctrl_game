import { useTheme, useThemedStyles } from "../ThemeProvider";
import { makeCardStyle } from "./Card.styles";
import type { CardProps } from "./Card.types";

export function Card({ children, tone = "surface", gap, style }: CardProps) {
  const theme = useTheme();
  const cardStyle = useThemedStyles(makeCardStyle);
  return <div style={{ ...cardStyle(tone, gap ?? theme.spacing.sm), ...style }}>{children}</div>;
}
