import { useState } from 'react';
import { Switch } from 'react-native';
import { createRoom, joinRoom, selectStatus } from '@ctrl-game/client';
import { Button, Input, Screen, Stack, Text, useTheme, useThemedStyles } from '../../../ui-kit';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { ErrorBanner } from '../ErrorBanner';
import { makeStyles } from './HomeScreen.styles';

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [asSpectator, setAsSpectator] = useState(false);

  const connected = status === 'connected';
  const canSubmit = connected && name.trim().length > 0;

  return (
    <Screen>
      <ErrorBanner />
      <Stack gap={theme.spacing.md}>
        <Stack gap={theme.spacing.xs}>
          <Text variant="muted">Ваше ім'я</Text>
          <Input value={name} onChangeText={setName} placeholder="Напр. Олег" maxLength={24} />
        </Stack>

        <Button
          variant="primary"
          disabled={!canSubmit}
          onPress={() => dispatch(createRoom({ name: name.trim() }))}>
          Створити кімнату
        </Button>

        <Text variant="muted" style={styles.divider}>
          або приєднатися
        </Text>

        <Stack gap={theme.spacing.xs}>
          <Text variant="muted">Код кімнати</Text>
          <Input value={code} onChangeText={setCode} placeholder="ABCD" maxLength={6} uppercase />
        </Stack>

        <Stack direction="row" gap={theme.spacing.sm} align="center">
          <Switch value={asSpectator} onValueChange={setAsSpectator} />
          <Text>Приєднатися як глядач</Text>
        </Stack>

        <Button
          disabled={!canSubmit || code.trim().length === 0}
          onPress={() => dispatch(joinRoom({ roomId: code.trim(), name: name.trim(), asSpectator }))}>
          Увійти
        </Button>

        {!connected && <Text variant="muted">Під'єднання до сервера…</Text>}
      </Stack>
    </Screen>
  );
}
