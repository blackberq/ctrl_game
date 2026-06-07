import { View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GAME_TITLE } from '@ctrl-game/shared';
import { selectRoom } from '@ctrl-game/client';
import { ConnectionBadge, HomeScreen, RoomScreen, ThemeToggle } from '../features/game';
import { useTheme } from '../ui-kit';
import { useAppSelector } from '../hooks';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * State-driven navigation: the active screen follows the store. When the player
 * is in a room we show Room, otherwise Home — React Navigation animates the
 * transition automatically (the recommended "auth flow" pattern).
 */
export function RootNavigator() {
  const room = useAppSelector(selectRoom);
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerTitle: GAME_TITLE,
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.xs }}>
            <ThemeToggle />
            <ConnectionBadge />
          </View>
        ),
      }}>
      {room ? (
        <Stack.Screen name="Room" component={RoomScreen} />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
    </Stack.Navigator>
  );
}
