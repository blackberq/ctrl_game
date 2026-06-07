import { ScrollView } from 'react-native';
import { useThemedStyles } from '../ThemeProvider';
import { makeStyles } from './Screen.styles';
import type { ScreenProps } from './Screen.types';

export function Screen({ children }: ScreenProps) {
  const styles = useThemedStyles(makeStyles);
  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}
