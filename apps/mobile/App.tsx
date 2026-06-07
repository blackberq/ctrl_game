/**
 * ctrl_game · mobile (React Native CLI)
 *
 * @format
 */

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { connectSocket, createGameStore, selectColorScheme } from '@ctrl-game/client';
import { getTheme } from '@ctrl-game/theme';
import { ThemeProvider } from './src/ui-kit';
import { RootNavigator } from './src/navigation';
import { useAppSelector } from './src/hooks';
import { SERVER_URL } from './src/config';

const store = createGameStore(SERVER_URL);
store.dispatch(connectSocket());

function ThemedApp() {
  const scheme = useAppSelector(selectColorScheme);
  const theme = getTheme(scheme);
  const navBase = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const navTheme = {
    ...navBase,
    colors: {
      ...navBase.colors,
      background: theme.colors.background,
      card: theme.colors.background,
      text: theme.colors.text,
      border: theme.colors.border,
      primary: theme.colors.primary,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <StatusBar barStyle={scheme === 'dark' ? 'light-content' : 'dark-content'} />
      <NavigationContainer theme={navTheme}>
        <RootNavigator />
      </NavigationContainer>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <ThemedApp />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
