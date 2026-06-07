import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { GAME_TITLE } from '@ctrl-game/shared';
import { clearError, selectError, selectRoom, selectStatus } from '@ctrl-game/client';
import { useAppDispatch, useAppSelector } from './hooks';
import { HomeScreen } from './screens/Home';
import { RoomScreen } from './screens/Room';

export function Root() {
  const dispatch = useAppDispatch();
  const room = useAppSelector(selectRoom);
  const status = useAppSelector(selectStatus);
  const error = useAppSelector(selectError);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{GAME_TITLE}</Text>
        <Text style={styles.status}>{status}</Text>
      </View>

      {error ? (
        <Pressable onPress={() => dispatch(clearError())} style={styles.error}>
          <Text style={styles.errorText}>{error} ✕</Text>
        </Pressable>
      ) : null}

      {room ? <RoomScreen /> : <HomeScreen />}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 14 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: '700' },
  status: { fontSize: 12, textTransform: 'uppercase', color: '#888' },
  error: { backgroundColor: '#fee2e2', borderRadius: 8, padding: 10 },
  errorText: { color: '#991b1b' },
});
