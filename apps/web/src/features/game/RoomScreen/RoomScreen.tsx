import { useState } from "react";
import {
  activePlayer,
  disconnectSocket,
  displayRemainingSec,
  eligiblePlayers,
  finishRound,
  isActivePlayer,
  isHost,
  markWord,
  pauseRound,
  resumeRound,
  selectGame,
  setMode,
  startRound,
} from "@ctrl-game/client";
import { Badge, Button, Card, Chip, Input, Stack, Text, useTheme, useThemedStyles } from "../../../ui-kit";
import { useAppDispatch, useAppSelector, useNow } from "../../../hooks";
import { TopicBanner } from "../TopicBanner";
import { WordList } from "../WordList";
import { PlayerList } from "../PlayerList";
import { MODES, makeStyles } from "./RoomScreen.styles";

export function RoomScreen() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const room = game.room!;
  const round = room.round;

  const host = isHost(room);
  const active = isActivePlayer(room);
  const now = useNow(round?.status === "running");
  const remaining = displayRemainingSec(game, now);

  const candidates = eligiblePlayers(room);
  const [activeId, setActiveId] = useState("");
  const [topic, setTopic] = useState("");
  const selectedActive = activeId || candidates[0]?.id || room.you.id;

  return (
    <Stack gap={theme.spacing.md}>
      <div style={styles.bar}>
        <Text>
          Кімната <b>{room.id}</b>
        </Text>
        <Button variant="ghost" onPress={() => dispatch(disconnectSocket())}>
          Вийти
        </Button>
      </div>

      <Stack direction="row" gap={theme.spacing.sm} wrap>
        <Badge tone="accent">{MODES.find((m) => m.value === room.settings.mode)?.label}</Badge>
        <Badge>{room.settings.difficulty}</Badge>
        <Badge>{room.you.role}</Badge>
      </Stack>

      {round && round.status !== "finished" ? (
        <Stack gap={theme.spacing.md}>
          <div style={styles.timer(remaining <= 10)}>⏱ {remaining}s</div>
          <TopicBanner topic={round.topic} />
          <Text variant="muted">
            Розповідає: {activePlayer(room)?.name} · {round.status}
          </Text>
          <WordList
            words={round.words}
            editable={host}
            onToggle={(index, used) => dispatch(markWord({ index, used }))}
          />
          {!host && active && <Text>Це ваші слова — вплітайте їх у розповідь!</Text>}
          {!host && !active && <Text variant="muted">Слова приховані до завершення раунду.</Text>}

          {host && (
            <Stack direction="row" gap={theme.spacing.sm}>
              {round.status === "running" ? (
                <Button onPress={() => dispatch(pauseRound())}>Пауза</Button>
              ) : (
                <Button onPress={() => dispatch(resumeRound())}>Продовжити</Button>
              )}
              <Button variant="primary" onPress={() => dispatch(finishRound())}>
                Завершити раунд
              </Button>
            </Stack>
          )}
        </Stack>
      ) : (
        <Stack gap={theme.spacing.md}>
          {round?.status === "finished" && (
            <Card>
              <Text variant="heading">Раунд завершено · секретні слова</Text>
              <WordList words={round.words} />
            </Card>
          )}

          {host ? (
            <Stack gap={theme.spacing.sm}>
              <Text variant="heading">Режим</Text>
              <Stack direction="row" gap={theme.spacing.sm} wrap>
                {MODES.map((m) => (
                  <Chip
                    key={m.value}
                    label={m.label}
                    selected={room.settings.mode === m.value}
                    onPress={() => dispatch(setMode({ mode: m.value }))}
                  />
                ))}
              </Stack>

              <Text variant="heading">Активний гравець</Text>
              <Stack direction="row" gap={theme.spacing.sm} wrap>
                {candidates.map((p) => (
                  <Chip
                    key={p.id}
                    label={p.id === room.you.id ? `${p.name} (ви)` : p.name}
                    selected={selectedActive === p.id}
                    onPress={() => setActiveId(p.id)}
                  />
                ))}
              </Stack>

              <Text variant="heading">Тема (необов'язково)</Text>
              <Input value={topic} onChangeText={setTopic} placeholder="Інакше випадкова" maxLength={120} />

              <Button
                variant="primary"
                onPress={() =>
                  dispatch(
                    startRound({ activePlayerId: selectedActive, topic: topic.trim() || undefined }),
                  )
                }
              >
                {round ? "Новий раунд" : "Почати раунд"}
              </Button>
            </Stack>
          ) : (
            <Text variant="muted">Очікуємо, поки ведучий почне раунд…</Text>
          )}
        </Stack>
      )}

      <Text variant="heading">Учасники ({room.players.length})</Text>
      <PlayerList players={room.players} youId={room.you.id} hostId={room.hostId} />
    </Stack>
  );
}
