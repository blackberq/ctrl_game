import { useThemedStyles } from "../ThemeProvider";
import { makeBadgeStyle } from "./Badge.styles";
import type { BadgeProps } from "./Badge.types";

export function Badge({ children, tone = "neutral" }: BadgeProps) {
  const badgeStyle = useThemedStyles(makeBadgeStyle);
  return <span style={badgeStyle(tone)}>{children}</span>;
}
