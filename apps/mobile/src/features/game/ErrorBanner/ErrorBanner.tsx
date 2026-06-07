import { Pressable } from 'react-native';
import { clearError, selectError } from '@ctrl-game/client';
import { Text, useTheme, useThemedStyles } from '../../../ui-kit';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { makeStyles } from './ErrorBanner.styles';

export function ErrorBanner() {
  const dispatch = useAppDispatch();
  const error = useAppSelector(selectError);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  if (!error) return null;

  return (
    <Pressable onPress={() => dispatch(clearError())} style={styles.banner}>
      <Text color={theme.colors.dangerText}>{error} ✕</Text>
    </Pressable>
  );
}
