import { useState } from 'react';
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native';
import type { GameMode } from '@ctrl-game/shared';
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
} from '@ctrl-game/client';
import { useAppDispatch, useAppSelector, useNow } from '../hooks';
import { Btn } from '../ui';

const MODES: { value: GameMode; label: string }[] = [
  { value: 'classic', label: 'Класичний' },
  { value: 'fast', label: 'Швидкий' },
  { value: 'hard', label: 'Складний' },
  { value: 'spectator', label: 'З глядачами' },
  { value: 'team', label: 'Командний' },
  { value: 'host_input', label: 'Слова ведучого' },
];

export function RoomScreen() {
  const dispatch = useAppDispatch();
  const game = useAppSelector(selectGame);
  const room = game.room!;
  const round = room.round;

  const host = isHost(room);
  const active = isActivePlayer(room);
  const now = useNow(round?.status === 'running');
  const remaining = displayRemainingSec(game, now);

  const candidates = eligiblePlayers(room);
  const [activeId, setActiveId] = useState('');
  const selectedActive = activeId || candidates[0]?.id || room.you.id;

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <Text>
          Кімната <Text style={styles.code}>{room.id}</Text>
        </Text>
        <Pressable onPress={() => dispatch(disconnectSocket())}>
          <Text style={styles.link}>Вийти</Text>
        </Pressable>
      </View>
      <Text style={styles.muted}>
        {MODES.find(m => m.value === room.settings.mode)?.label} · {room.settings.difficulty} ·{' '}
        {room.you.role}
      </Text>

      {round && round.status !== 'finished' ? (
        <View style={styles.section}>
          <Text style={[styles.timer, remaining <= 10 && styles.timerLow]}>⏱ {remaining}s</Text>
          <Text style={styles.muted}>
            Розповідає: {activePlayer(room)?.name} · {round.status}
          </Text>

          {round.words.map((w, i) => (
            <View key={i} style={[styles.word, w.used && styles.wordUsed]}>
              <Text style={styles.wordText}>{w.text ?? '•••••'}</Text>
              {host && (
                <Switch
                  value={w.used}
                  onValueChange={value => {
                    dispatch(markWord({ index: i, used: value }));
                  }}
                />
              )}
            </View>
          ))}

          {!host && active && <Text>Це ваші слова — вплітайте їх у розповідь!</Text>}
          {!host && !active && (
            <Text style={styles.muted}>Слова приховані до завершення раунду.</Text>
          )}

          {host && (
            <View style={styles.row}>
              {round.status === 'running' ? (
                <Btn title="Пауза" onPress={() => dispatch(pauseRound())} />
              ) : (
                <Btn title="Продовжити" onPress={() => dispatch(resumeRound())} />
              )}
              <Btn title="Завершити" primary onPress={() => dispatch(finishRound())} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.section}>
          {round?.status === 'finished' && (
            <View style={styles.section}>
              <Text style={styles.heading}>Раунд завершено · секретні слова:</Text>
              {round.words.map((w, i) => (
                <View key={i} style={[styles.word, w.used && styles.wordUsed]}>
                  <Text style={styles.wordText}>{w.text}</Text>
                  <Text>{w.used ? '✓' : '—'}</Text>
                </View>
              ))}
            </View>
          )}

          {host ? (
            <View style={styles.section}>
              <Text style={styles.heading}>Режим</Text>
              <View style={styles.chips}>
                {MODES.map(m => (
                  <Pressable
                    key={m.value}
                    onPress={() => dispatch(setMode({ mode: m.value }))}
                    style={[styles.chip, room.settings.mode === m.value && styles.chipOn]}>
                    <Text style={room.settings.mode === m.value ? styles.chipOnText : undefined}>
                      {m.label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={styles.heading}>Активний гравець</Text>
              <View style={styles.chips}>
                {candidates.map(p => (
                  <Pressable
                    key={p.id}
                    onPress={() => setActiveId(p.id)}
                    style={[styles.chip, selectedActive === p.id && styles.chipOn]}>
                    <Text style={selectedActive === p.id ? styles.chipOnText : undefined}>
                      {p.name}
                      {p.id === room.you.id ? ' (ви)' : ''}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Btn
                title={round ? 'Новий раунд' : 'Почати раунд'}
                primary
                onPress={() => dispatch(startRound({ activePlayerId: selectedActive }))}
              />
            </View>
          ) : (
            <Text style={styles.muted}>Очікуємо, поки ведучий почне раунд…</Text>
          )}
        </View>
      )}

      <Text style={styles.heading}>Учасники ({room.players.length})</Text>
      {room.players.map(p => (
        <View key={p.id} style={[styles.player, !p.connected && styles.offline]}>
          <Text>
            {p.name}
            {p.id === room.you.id ? ' (ви)' : ''}
            {p.id === room.hostId ? ' 👑' : ''}
          </Text>
          <Text style={styles.score}>{p.score}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  bar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  code: { fontSize: 18, fontWeight: '700', letterSpacing: 2 },
  link: { color: '#4f46e5' },
  muted: { color: '#888' },
  section: { gap: 8 },
  heading: { fontSize: 16, fontWeight: '600', marginTop: 6 },
  timer: { fontSize: 40, fontWeight: '700', textAlign: 'center' },
  timerLow: { color: '#dc2626' },
  word: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  wordUsed: { borderColor: '#16a34a', backgroundColor: 'rgba(22,163,74,0.1)' },
  wordText: { fontSize: 18 },
  row: { flexDirection: 'row', gap: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderWidth: 1, borderColor: '#bbb', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  chipOn: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  chipOnText: { color: '#fff' },
  player: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(127,127,127,0.08)',
  },
  offline: { opacity: 0.45 },
  score: { fontWeight: '700' },
});
