import { Stack, useTheme, useThemedStyles } from "../../../ui-kit";
import { makeStyles } from "./WordList.styles";
import type { WordListProps } from "./WordList.types";

export function WordList({ words, editable = false, onToggle }: WordListProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Stack gap={theme.spacing.sm}>
      {words.map((word, index) => (
        <div key={index} style={styles.row(word.used)}>
          {editable ? (
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={word.used}
                onChange={(e) => onToggle?.(index, e.target.checked)}
              />
              {word.text}
            </label>
          ) : (
            <span>{word.text ?? "•••••"}</span>
          )}
        </div>
      ))}
    </Stack>
  );
}
