import { Text, View } from 'react-native';
import { Stack, useTheme, useThemedStyles } from '../../../ui-kit';
import { makeStyles } from './PlayerList.styles';
import type { PlayerListProps } from './PlayerList.types';

export function PlayerList({ players, youId, hostId }: PlayerListProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Stack gap={theme.spacing.xs}>
      {players.map(player => (
        <View key={player.id} style={[styles.row, !player.connected && styles.offline]}>
          <Text style={styles.name}>
            {player.name}
            {player.id === youId ? ' (ви)' : ''}
            {player.id === hostId ? ' 👑' : ''}
          </Text>
          <Text style={styles.score}>{player.score}</Text>
        </View>
      ))}
    </Stack>
  );
}
