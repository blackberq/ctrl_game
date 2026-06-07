import { useState } from "react";
import { createRoom, joinRoom, selectStatus } from "@ctrl-game/client";
import { Button, Input, Stack, Text, useTheme, useThemedStyles } from "../../../ui-kit";
import { useAppDispatch, useAppSelector } from "../../../hooks";
import { makeStyles } from "./HomeScreen.styles";

export function HomeScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectStatus);
  const theme = useTheme();
  const styles = useThemedStyles(makeStyles);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [asSpectator, setAsSpectator] = useState(false);

  const connected = status === "connected";
  const canSubmit = connected && name.trim().length > 0;

  return (
    <Stack gap={theme.spacing.md}>
      <Stack gap={theme.spacing.xs}>
        <span style={styles.fieldLabel}>Ваше ім'я</span>
        <Input value={name} onChangeText={setName} placeholder="Напр. Олег" maxLength={24} />
      </Stack>

      <Button
        variant="primary"
        disabled={!canSubmit}
        onPress={() => dispatch(createRoom({ name: name.trim() }))}
      >
        Створити кімнату
      </Button>

      <span style={styles.divider}>або приєднатися</span>

      <Stack gap={theme.spacing.xs}>
        <span style={styles.fieldLabel}>Код кімнати</span>
        <Input value={code} onChangeText={setCode} placeholder="ABCD" maxLength={6} uppercase />
      </Stack>

      <label style={styles.checkboxRow}>
        <input
          type="checkbox"
          checked={asSpectator}
          onChange={(e) => setAsSpectator(e.target.checked)}
        />
        <Text>Приєднатися як глядач</Text>
      </label>

      <Button
        disabled={!canSubmit || code.trim().length === 0}
        onPress={() => dispatch(joinRoom({ roomId: code.trim(), name: name.trim(), asSpectator }))}
      >
        Увійти
      </Button>

      {!connected && <Text variant="muted">Під'єднання до сервера…</Text>}
    </Stack>
  );
}
