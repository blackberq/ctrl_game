import { StyleSheet } from 'react-native';
import type { Theme } from '@ctrl-game/theme';
import type { ModeOption } from './RoomScreen.types';

export const MODES: ModeOption[] = [
  { value: 'classic', label: 'Класичний' },
  { value: 'fast', label: 'Швидкий' },
  { value: 'hard', label: 'Складний' },
  { value: 'spectator', label: 'З глядачами' },
  { value: 'team', label: 'Командний' },
  { value: 'host_input', label: 'Слова ведучого' },
];

export function makeStyles(theme: Theme) {
  return StyleSheet.create({
    bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    code: { fontWeight: theme.fontWeight.bold, letterSpacing: 2 },
    timer: {
      fontSize: theme.fontSize.display,
      fontWeight: theme.fontWeight.bold,
      textAlign: 'center',
      color: theme.colors.text,
    },
    timerLow: { color: theme.colors.danger },
  });
}
