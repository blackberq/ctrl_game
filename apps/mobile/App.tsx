/**
 * ctrl_game · mobile (React Native CLI)
 *
 * @format
 */

import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { connectSocket, createGameStore } from '@ctrl-game/client';
import { Root } from './src/Root';
import { SERVER_URL } from './src/config';

const store = createGameStore(SERVER_URL);
store.dispatch(connectSocket());

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView style={{ flex: 1 }}>
          <Root />
        </SafeAreaView>
      </Provider>
    </SafeAreaProvider>
  );
}

export default App;
