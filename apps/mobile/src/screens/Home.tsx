import { useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import { createRoom, joinRoom, selectStatus } from '@ctrl-game/client';
import { useAppDispatch, useAppSelector } from '../hooks';
import { Btn } from '../ui';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [asSpectator, setAsSpectator] = useState(false);

  const connected = status === 'connected';
  const canSubmit = connected && name.trim().length > 0;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>Ваше ім'я</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Напр. Олег"
        maxLength={24}
        style={styles.input}
      />

      <Btn
        title="Створити кімнату"
        primary
        disabled={!canSubmit}
        onPress={() => dispatch(createRoom({ name: name.trim() }))}
      />

      <Text style={styles.divider}>або приєднатися</Text>

      <Text style={styles.label}>Код кімнати</Text>
      <TextInput
        value={code}
        onChangeText={t => setCode(t.toUpperCase())}
        placeholder="ABCD"
        autoCapitalize="characters"
        maxLength={6}
        style={styles.input}
      />

      <View style={styles.row}>
        <Switch value={asSpectator} onValueChange={setAsSpectator} />
        <Text>Приєднатися як глядач</Text>
      </View>

      <Btn
        title="Увійти"
        disabled={!canSubmit || code.trim().length === 0}
        onPress={() =>
          dispatch(joinRoom({ roomId: code.trim(), name: name.trim(), asSpectator }))
        }
      />

      {!connected && <Text style={styles.muted}>Під'єднання до сервера…</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { gap: 12 },
  label: { fontSize: 13, color: '#888' },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  divider: { textAlign: 'center', color: '#888', marginVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  muted: { color: '#888', textAlign: 'center' },
});
