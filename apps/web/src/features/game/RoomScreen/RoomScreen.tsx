import { useEffect, useState } from "react";
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
  updateSettings,
} from "@ctrl-game/client";
import { TOPICS } from "@ctrl-game/shared";
import { Badge, Button, Card, Chip, Input, Stack, Text, useTheme, useThemedStyles } from "../../../ui-kit";
import { useAppDispatch, useAppSelector, useNow } from "../../../hooks";
import { TopicBanner } from "../TopicBanner";
import { WordList } from "../WordList";
import { PlayerList } from "../PlayerList";
import { MODES, makeStyles } from "./RoomScreen.styles";

type TopicMode = "preset" | "custom";

const MIN_TIMER_SEC = 15;
const MAX_TIMER_SEC = 300;

function clampTimer(value: string): number {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 60;
  return Math.min(MAX_TIMER_SEC, Math.max(MIN_TIMER_SEC, parsed));
}

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
  const [topicMode, setTopicMode] = useState<TopicMode>("preset");
  const [selectedTopic, setSelectedTopic] = useState(
    () => TOPICS[Math.floor(Math.random() * TOPICS.length)] ?? "",
  );
  const [customTopic, setCustomTopic] = useState("");
  const [timerSec, setTimerSec] = useState(String(room.settings.roundDurationSec));
  const selectedActive = activeId || candidates[0]?.id || room.you.id;
  const normalizedTimerSec = clampTimer(timerSec);
  const startTopic =
    topicMode === "custom" ? customTopic.trim() || undefined : selectedTopic || undefined;

  useEffect(() => {
    setTimerSec(String(room.settings.roundDurationSec));
  }, [room.settings.roundDurationSec]);

  function randomizeTopic() {
    const next = TOPICS[Math.floor(Math.random() * TOPICS.length)];
    setSelectedTopic(next);
  }

  function startConfiguredRound() {
    if (normalizedTimerSec !== room.settings.roundDurationSec) {
      dispatch(updateSettings({ settings: { roundDurationSec: normalizedTimerSec } }));
    }
    dispatch(startRound({ activePlayerId: selectedActive, topic: startTopic }));
  }

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

              <Text variant="heading">Тема розповіді</Text>
              <Stack direction="row" gap={theme.spacing.sm} wrap>
                <Chip
                  label="Готові питання"
                  selected={topicMode === "preset"}
                  onPress={() => setTopicMode("preset")}
                />
                <Chip
                  label="Своя тема"
                  selected={topicMode === "custom"}
                  onPress={() => setTopicMode("custom")}
                />
              </Stack>

              {topicMode === "preset" ? (
                <Stack gap={theme.spacing.sm}>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    style={styles.select}
                  >
                    {TOPICS.map((presetTopic) => (
                      <option key={presetTopic} value={presetTopic}>
                        {presetTopic}
                      </option>
                    ))}
                  </select>
                  <Button onPress={randomizeTopic}>Випадкова тема</Button>
                </Stack>
              ) : (
                <Input
                  value={customTopic}
                  onChangeText={setCustomTopic}
                  placeholder="Напр. Історія про найгіршу відпустку"
                  maxLength={140}
                />
              )}

              <Text variant="heading">Таймер раунду</Text>
              <Stack gap={theme.spacing.xs}>
                <Input value={timerSec} onChangeText={setTimerSec} placeholder="60" maxLength={3} />
                <Text variant="muted">
                  {normalizedTimerSec} секунд · можна від {MIN_TIMER_SEC} до {MAX_TIMER_SEC}
                </Text>
              </Stack>

              <Button
                variant="primary"
                onPress={startConfiguredRound}
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
