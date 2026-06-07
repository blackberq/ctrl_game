import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { lightTheme, type Theme } from '@ctrl-game/theme';

const ThemeContext = createContext<Theme>(lightTheme);

export function ThemeProvider({ theme, children }: { theme: Theme; children: ReactNode }) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

/** Active theme from the nearest ThemeProvider. */
export function useTheme(): Theme {
  return useContext(ThemeContext);
}

/** Memoized styles built from the active theme. `factory` must be stable (module-level). */
export function useThemedStyles<T>(factory: (theme: Theme) => T): T {
  const theme = useTheme();
  return useMemo(() => factory(theme), [theme, factory]);
}
