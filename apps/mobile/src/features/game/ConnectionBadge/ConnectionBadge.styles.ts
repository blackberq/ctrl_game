import { StyleSheet } from 'react-native';
import { theme } from '@ctrl-game/theme';
import type { BadgeTone } from '../../../ui-kit';

export const statusTone: Record<string, BadgeTone> = {
  connected: 'success',
  connecting: 'warning',
  disconnected: 'danger',
};

export const styles = StyleSheet.create({
  wrap: { marginRight: theme.spacing.sm },
});
