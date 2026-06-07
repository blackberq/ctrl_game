import { useEffect } from "react";
import { GAME_TITLE } from "@ctrl-game/shared";
import { clearError, selectColorScheme, selectError, selectRoom, selectStatus } from "@ctrl-game/client";
import { getTheme } from "@ctrl-game/theme";
import { Badge, Stack, Text, ThemeProvider, useTheme } from "./ui-kit";
import { HomeScreen, RoomScreen, ThemeToggle } from "./features/game";
import { useAppDispatch, useAppSelector } from "./hooks";

const statusTone = { connected: "success", connecting: "warning", disconnected: "danger" } as const;

function AppInner() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const room = useAppSelector(selectRoom);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  // Keep the whole page background in sync with the theme.
  useEffect(() => {
    document.body.style.background = theme.colors.background;
    document.body.style.color = theme.colors.text;
  }, [theme]);

  return (
    <main style={{ maxWidth: 560, margin: "0 auto", padding: theme.spacing.xl, minHeight: "100vh" }}>
      <Stack gap={theme.spacing.md}>
        <Stack direction="row" justify="space-between" align="center">
          <Text variant="title">{GAME_TITLE}</Text>
          <Stack direction="row" gap={theme.spacing.sm} align="center">
            <Badge tone={statusTone[status]}>{status}</Badge>
            <ThemeToggle />
          </Stack>
        </Stack>

        {error && (
          <div
            role="alert"
            onClick={() => dispatch(clearError())}
            style={{
              background: theme.colors.dangerSurface,
              color: theme.colors.dangerText,
              padding: theme.spacing.sm,
              borderRadius: theme.radius.md,
              cursor: "pointer",
            }}
          >
            {error} ✕
          </div>
        )}

        {room ? <RoomScreen /> : <HomeScreen />}
      </Stack>
    </main>
  );
}

export function App() {
  const scheme = useAppSelector(selectColorScheme);
  return (
    <ThemeProvider theme={getTheme(scheme)}>
      <AppInner />
    </ThemeProvider>
  );
}
