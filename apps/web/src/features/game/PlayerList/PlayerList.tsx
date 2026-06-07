import { Stack, Text, useTheme, useThemedStyles } from "../../../ui-kit";
import { makeStyles } from "./PlayerList.styles";
import type { PlayerListProps } from "./PlayerList.types";

export function PlayerList({ players, youId, hostId }: PlayerListProps) {
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Stack gap={theme.spacing.xs}>
      {players.map((player) => (
        <div key={player.id} style={styles.row(player.connected)}>
          <Text>
            {player.name}
            {player.id === youId ? " (ви)" : ""}
            {player.id === hostId ? " 👑" : ""}
          </Text>
          <span style={styles.score}>{player.score}</span>
        </div>
      ))}
    </Stack>
  );
}
