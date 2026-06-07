import { Switch, Text, View } from 'react-native';
import { Stack, useTheme, useThemedStyles } from '../../../ui-kit';
import { makeStyles } from './WordList.styles';
import type { WordListProps } from './WordList.types';

export function WordList({ words, editable = false, onToggle }: WordListProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Stack gap={theme.spacing.sm}>
      {words.map((word, index) => (
        <View key={index} style={[styles.row, word.used && styles.rowUsed]}>
          <Text style={styles.word}>{word.text ?? '•••••'}</Text>
          {editable && (
            <Switch
              value={word.used}
              onValueChange={value => {
                onToggle?.(index, value);
              }}
            />
          )}
        </View>
      ))}
    </Stack>
  );
}
