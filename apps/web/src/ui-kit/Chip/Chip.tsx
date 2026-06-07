import { useThemedStyles } from "../ThemeProvider";
import { makeChipStyle } from "./Chip.styles";
import type { ChipProps } from "./Chip.types";

export function Chip({ label, selected = false, onPress }: ChipProps) {
  const chipStyle = useThemedStyles(makeChipStyle);
  return (
    <button type="button" onClick={onPress} style={chipStyle(selected)}>
      {label}
    </button>
  );
}
